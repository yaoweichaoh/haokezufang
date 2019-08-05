import React, { Component } from "react";

// 导入API
import { API, getCurrentCity } from "../../../../utils";

// 导入动画组件
import { Spring } from "react-spring/renderprops";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import styles from "./index.module.css";
// 高亮数据
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
};

// 选中值对象：用来设置每一次的选中值
const selectedValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: []
};
export default class Filter extends Component {
  state = {
    // 标题数据
    titleSelectedStatus,
    // 表示展示对话框的类型
    openType: "",
    // 对话框数据
    filtersData: {},
    // 选中值对象：用来设置每一次的选中值
    selectedValues
  };

  componentDidMount() {
    this.htmlBody = document.body;
    this.getFilterPicker();
  }

  async getFilterPicker() {
    const { value } = await getCurrentCity();
    const res = await API.get("/houses/condition", {
      params: {
        id: value
      }
    });
    // console.log(res);
    this.setState({
      filtersData: res.data.body
    });
  }
  // 高亮点击事件
  changeTitleSelected = type => {
    this.htmlBody.className = "hidden";
    // 在标题点击事件 onTitleClick 方法中，获取到两个状态：标题选中状态对象和筛选条件的选中值对象。
    const { titleSelectedStatus, selectedValues } = this.state;

    const newTitleSelectedStatus = { ...titleSelectedStatus };
    // 使用 Object.keys() 方法，遍历标题选中状态对象。
    Object.keys(titleSelectedStatus).forEach(key => {
      // 先判断是否为当前标题，如果是，直接让该标题选中状态为 true（高亮）。

      // 获取选定状态的每一项
      const selectVal = selectedValues[key];

      // 否则，分别判断每个标题的选中值是否与默认值相同。
      if (key === type) {
        newTitleSelectedStatus[type] = true;
      } else {
        const typeSelect = this.getTitleSelectedStatus(key, selectVal);

        // Object.assign方法  后面对象可以覆盖前面对象的值
        Object.assign(newTitleSelectedStatus, typeSelect);
      }
      // console.log(newTitleSelectedStatus);
      this.setState({
        // 更新状态 titleSelectedStatus 的值为：newTitleSelectedStatus。
        titleSelectedStatus: newTitleSelectedStatus,
        openType: type
      });
    });
  };
  // 封装筛选高亮函数
  getTitleSelectedStatus(type, selectVal) {
    const newTitleSelectedStatus = {};
    if (
      type === "area" &&
      (selectVal.length === 3 || selectVal[0] === "subway")
    ) {
      // 如果不同，则设置该标题的选中状态为 true。
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectVal[0] !== "null") {
      // 如果不同，则设置该标题的选中状态为 true。
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectVal[0] !== "null") {
      // 如果不同，则设置该标题的选中状态为 true。
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectVal.length > 0) {
      newTitleSelectedStatus[type] = true;
    } else {
      // 如果相同，则设置该标题的选中状态为 false。
      newTitleSelectedStatus[type] = false;
    }
    return newTitleSelectedStatus;
  }

  // 隐藏对话框  取消
  onCancel = type => {
    this.htmlBody.className = "";
    // console.log("当前值", type);
    const { selectedValues, titleSelectedStatus } = this.state;
    //  当前选中值
    const selectVal = selectedValues[type];
    // console.log(selectVal);
    const newTitleSelectedStatus = this.getTitleSelectedStatus(type, selectVal);
    this.setState({
      openType: "",
      titleSelectedStatus: { ...titleSelectedStatus, ...newTitleSelectedStatus }
    });
  };

  onSave = (type, value) => {
    // console.log(type);
    // console.log(value);
    const { titleSelectedStatus, selectedValues } = this.state;

    const newTitleSelectedStatus = this.getTitleSelectedStatus(type, value);

    // 筛选条件的最新选中值：
    const newSelectedValues = {
      ...selectedValues,
      [type]: value
    };

    /* 
① 在 Filter 组件的 onSave 方法中，根据最新 selectedValues 组装筛选条件数据 filters。
② 获取区域数据的参数名： area 或 subway（选中值数组的第一个元素）。
③ 获取区域数据的值（以最后一个 value 为准）。
④ 获取方式和租金的值（选中值的第一个元素）。
⑤ 获取筛选（more）的值（将选中值数组转化为以逗号分隔的字符串）。
*/

    const filters = {};
    //  筛选more
    const area = newSelectedValues.area;

    const areaKey = area[0];
    let areaValue;

    if (area.length === 2) {
      areaValue = "null";
    } else if (area.length === 3) {
      areaValue = area[2] === "null" ? area[1] : area[2];
    }

    // 添加到filters对象中
    filters[areaKey] = areaValue;

    // 筛选 mode price
    filters.rentType = newSelectedValues.mode[0];
    filters.price = newSelectedValues.price[0];

    // 筛选more
    filters.more = newSelectedValues.more.join(",");
    // console.log(newSelectedValues, filters);

    // 调用父组件传过来的方法
    this.props.onFilter(filters);

    this.setState({
      openType: "",
      selectedValues: newSelectedValues,
      titleSelectedStatus: { ...titleSelectedStatus, ...newTitleSelectedStatus }
    });
  };

  // 来渲染 FilterPicker 组件
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state;

    if (openType === "more" || openType === "") {
      return null;
    }

    let data;

    let cols = 1;
    let defaultValue = selectedValues[openType];
    // console.log(defaultValue);
    switch (openType) {
      case "area":
        data = [area, subway];
        cols = 3;
        break;
      case "mode":
        data = rentType;
        break;
      case "price":
        data = price;
        break;
    }

    return (
      <FilterPicker
        key={openType}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
        onSave={this.onSave}
        onCancel={this.onCancel}
      />
    );
  }

  //来渲染FilterMore组件
  renderFilterMore() {
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic },
      selectedValues
    } = this.state;

    if (openType !== "more") return null;

    const data = { roomType, oriented, floor, characteristic };

    // 默认值
    const defaultValue = selectedValues.more;
    return (
      <FilterMore
        data={data}
        type={openType}
        defaultValue={defaultValue}
        onSave={this.onSave}
        onCancel={this.onCancel}
      />
    );
  }

  renderMask() {
    const { openType } = this.state;

    const isHide = openType === "more" || openType === "";

    return (
      <Spring to={{ opacity: isHide ? 0 : 1 }}>
        {props => {
          if (props.opacity === 0) {
            return null;
          }
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={() => this.onCancel(openType)}
            />
          );
        }}
      </Spring>
    );
  }
  render() {
    const { titleSelectedStatus } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}

        {/* {openType === "area" || openType === "mode" || openType === "price" ? (
          <div
            className={styles.mask}
            onClick={() => this.onCancel(openType)}
          />
        ) : null} */}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.changeTitleSelected}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}
