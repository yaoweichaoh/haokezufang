import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

// 导入动画组件
import { Spring } from "react-spring/renderprops";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  };

  // 注册点击事件
  headerClick(id) {
    // console.log(id);
    const { selectedValues } = this.state;
    let newselectedValues = [...selectedValues];
    if (selectedValues.indexOf(id) > -1) {
      //  有
      newselectedValues = newselectedValues.filter(item => item !== id);
    } else {
      // 没有
      newselectedValues.push(id);
    }
    // console.log(newselectedValues);
    this.setState({
      selectedValues: newselectedValues
    });
  }

  // 渲染标签
  renderFilters(data) {
    const { selectedValues } = this.state;
    // 高亮类名： styles.tagActive
    return data.map(item => {
      const selectId = selectedValues.indexOf(item.value) > -1;

      return (
        <span
          key={item.value}
          className={[styles.tag, selectId ? styles.tagActive : ""].join(" ")}
          onClick={() => this.headerClick(item.value)}
        >
          {item.label}
        </span>
      );
    });
  }

  // 清除按钮事件
  onCancel = () => {
    this.setState({
      selectedValues: []
    });
  };
  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
      type,
      onSave,
      onCancel
    } = this.props;

    const { selectedValues } = this.state;
    // console.log(roomType, oriented, floor, characteristic);

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {/* {this.renderMore()} */}
        <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
          {props => (
            <div
              style={props}
              className={styles.mask}
              onClick={() => onCancel(type)}
            />
          )}
        </Spring>
        {/* <div className={styles.mask} onClick={() => onCancel(type)} /> */}

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          iscontent="清除"
          onCancel={this.onCancel}
          onSave={() => onSave(type, selectedValues)}
        />
      </div>
    );
  }
}
