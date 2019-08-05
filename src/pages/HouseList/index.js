import React from "react";

// 导入searchHeader组件
import SearchHeader from "../../components/SearchHeader";

import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from "react-virtualized";

// 导入Filter组件
import Filter from "./components/Filter";

// 导入Sticty组件
import Sticky from "../../components/Sticty";

import { Flex, Toast } from "antd-mobile";

// 导入API
import { API, getCurrentCity, BASE_URL } from "../../utils";

// 导入HouseItem组件
import HouseItem from "../../components/HouseItem";

// 导入NOHouse组件
import NoHouse from "../../components/NoHouse";

// 导入样式
import styles from "./index.module.scss";

export default class HouseList extends React.Component {
  state = {
    //  存储房屋列表数据
    list: [],
    //  总条数
    count: 0,
    isHouse: false
  };

  label = "";
  value = "";
  async componentDidMount() {
    const { value, label } = await getCurrentCity();
    this.value = value;
    this.label = label;
    // console.log(label);
    this.searchHouseList();
  }
  filters = {};

  onFilter = filters => {
    // console.log(filters);
    this.filters = filters;
    this.searchHouseList();
  };

  async searchHouseList(start = 1, end = 20) {
    Toast.loading("loading...", 0, null, true);
    const res = await API.get("/houses", {
      params: {
        ...this.filters,
        cityId: this.value,
        start,
        end
      }
    });

    const { list, count } = res.data.body;
    Toast.hide();
    // console.log(res);
    if (count > 0) {
      Toast.info(`共${count}数据房源`, 1.5, null, false);
    }
    // 回到页面顶部
    window.scrollTo(0, 0);

    // 添加到sate中
    this.setState({
      list,
      count,
      isHouse: true
    });
  }

  // 渲染房屋列表
  //   key, // 每一项的唯一标识
  //   index, // 每一行的索引号
  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state;
    const item = list[index];

    if (!item) {
      // console.log(item, "不存在");
      return (
        <div key={key} style={style}>
          <p className={styles.loading}>loading...</p>
        </div>
      );
    }

    return (
      <HouseItem
        key={key}
        style={style}
        {...item}
        houseImg={`${BASE_URL}${item.houseImg}`}
      />
    );
  };

  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  };

  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async resolve => {
      // const { value } = await getCurrentCity();

      const res = await API.get("/houses", {
        params: {
          ...this.filters,
          cityId: this.value,
          start: startIndex + 1,
          end: stopIndex
        }
      });

      resolve();
      // console.log(res);
      const { list, count } = res.data.body;
      this.setState({
        list: [...this.state.list, ...list],
        count
      });
    });
  };

  renderHouseList = () => {
    const { count, isHouse } = this.state;

    if (isHouse && count <= 0) {
      return <NoHouse>没有更多房源,请换个搜索条件试试~</NoHouse>;
    } else {
      return (
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={count}
          minimumBatchSize={21}
        >
          {({ onRowsRendered, registerChild }) => {
            return (
              <WindowScroller>
                {({ height, isScrolling, scrollTop }) => {
                  return (
                    <AutoSizer>
                      {({ width }) => (
                        <List
                          height={height}
                          width={width}
                          rowHeight={120}
                          rowCount={count}
                          rowRenderer={this.rowRenderer}
                          isScrolling={isScrolling}
                          scrollTop={scrollTop}
                          autoHeight
                          onRowsRendered={onRowsRendered}
                          ref={registerChild}
                        />
                      )}
                    </AutoSizer>
                  );
                }}
              </WindowScroller>
            );
          }}
        </InfiniteLoader>
      );
    }
  };
  render() {
    return (
      <div className={styles.root}>
        <Flex className={styles.searchList}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader cityName={this.label} className={styles.listSearch} />
        </Flex>

        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>
        {
          // height：视口高度
          // isScrolling：表示是否滚动中，用来覆盖List组件自身的滚动状态
          // scrollTop：页面滚动的距离，用来同步 List 组件的滚动距离
          // 为 List 组件提供状态，同时还需设置 List 组件的 autoHeight 属性
          // isRowLoaded 表示每一行数据是否加载完成
          // loadMoreRows 加载更多数据的方法，在需要加载更多数据时，会调用该方法
          // rowCount 列表数据总条数
        }
        <div className={styles.HouserList}>{this.renderHouseList()}</div>
      </div>
    );
  }
}
