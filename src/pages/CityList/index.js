import React from "react";

// 导入utils组件
import { setCity } from "../../utils";

// 导入NavHeader组件
import NavHeader from "../../components/NavHeader";

import { List, AutoSizer } from "react-virtualized";
// 导入Navbar组件
import { Toast } from "antd-mobile";

import { getCurrentCity, API } from "../../utils";
// 导入scss样式
import "./index.scss";

const formCityList = list => {
  const cityList = {};

  list.forEach(item => {
    const firstLetter = item.short.slice(0, 1);
    // console.log(firstLetter);
    if (firstLetter in cityList) {
      // 如果有 就追加到数组中
      cityList[firstLetter].push(item);
    } else {
      // 如果没有  就把当前的当索引key
      cityList[firstLetter] = [item];
    }
  });

  // 获取城市索引
  // Object.keys(obj) 作用：获取对象中所有的键，并且放到一个数组中返回
  const cityIndex = Object.keys(cityList).sort();
  // console.log(cityIndex);
  return {
    cityList,
    cityIndex
  };
};

const formatCityIndex = function(leetr) {
  switch (leetr) {
    case "hot":
      return "热门城市";
    case "#":
      return "当前定位";
    default:
      return leetr.toUpperCase();
  }
};

const titleHerigth = 36;
const nameHerigth = 50;

// 有房源的列表
const CITY_HAS_HOUSE = ["上海", "北京", "广州", "深圳"];
export default class CityList extends React.Component {
  state = {
    cityListL: {},
    cityIndex: [],
    activeIndex: 0
  };

  listRef = React.createRef();

  async componentDidMount() {
    await this.funList();

    // 提前计算 List 列表中每一行的高度，计算后， scrollToRow() 方法就可以精确的跳转到指定位置
    this.listRef.current.measureAllRows();
  }

  async funList() {
    // 获取城市列表数据
    const res = await API.get("/area/city?level=1");

    // console.log(res);
    const { cityList, cityIndex } = formCityList(res.data.body);

    //  热门城市数据
    const cityRes = await API.get("/area/hot");
    // console.log(cityRes);
    //hot 作为热门城市的索引
    cityIndex.unshift("hot");
    cityList["hot"] = cityRes.data.body;

    // console.log(cityIndex, cityList);
    const courCity = await getCurrentCity();

    cityIndex.unshift("#");
    cityList["#"] = [courCity];

    this.setState({
      cityList,
      cityIndex
    });
  }

  // function rowRenderer({
  //   key, // 每一项的唯一标识
  //   index, // 每一行的索引号
  //   isScrolling, // 表示当前行是否正在滚动，如果是滚动结果为true；否则，为false
  //   isVisible, // 当前列表项是否可见
  rowRenderer = ({ key, index, style }) => {
    const { cityIndex, cityList } = this.state;

    const leetr = cityIndex[index];

    const list = cityList[leetr];
    // console.log(list);
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(leetr)}</div>
        {list.map(item => (
          <div
            key={item.value}
            className="name"
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  // 切换城市
  changeCity = ({ label, value }) => {
    if (CITY_HAS_HOUSE.indexOf(label) > -1) {
      setCity({ label, value });
      this.props.history.go(-1);
    } else {
      Toast.info("该城市暂无房源数据", 1);
    }
  };

  // 右侧渲染列表
  renderCityIndex() {
    const { cityIndex, activeIndex } = this.state;

    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => this.goToCityIndex(index)}
      >
        <span className={index === activeIndex ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ));
  }

  // 点击右侧索引跳转到对应的城市列表
  goToCityIndex = index => {
    // 跳转到指定的索引号对应的列表位置
    this.listRef.current.scrollToRow(index);
  };

  // 动态渲染每行的高度
  calcRowHeight = ({ index }) => {
    const { cityIndex, cityList } = this.state;

    const leetr = cityIndex[index];

    const list = cityList[leetr];
    return titleHerigth + nameHerigth * list.length;
  };

  // 滚动右边索引高亮
  onRowsRendered = ({ startIndex }) => {
    const { activeIndex } = this.state;

    if (activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      });
    }
  };
  render() {
    return (
      <div className="nav-box">
        <NavHeader>城市选择</NavHeader>

        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.listRef}
              height={height}
              width={width}
              rowHeight={100}
              rowCount={this.state.cityIndex.length}
              rowRenderer={this.rowRenderer}
              rowHeight={this.calcRowHeight}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>

        {/* 右侧列表 */}

        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
