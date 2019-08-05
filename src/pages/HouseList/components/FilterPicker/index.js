import React, { Component } from "react";

import { PickerView } from "antd-mobile";

import FilterFooter from "../../../../components/FilterFooter";

// const province = [];

export default class FilterPicker extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     value: this.props.defaultValue
  //   };
  // }
  state = {
    value: this.props.defaultValue
  };
  // componentDidUpdate(prevProps) {
  //   // console.log("之前", prevProps.defaultValue);
  //   // console.log("更新后", this.props.defaultValue);
  //   // // const { defaultValue } = this.props;
  //   // 更新前跟更新后比较
  //   if (this.props.defaultValue !== prevProps.defaultValue) {
  //     this.setState({
  //       value: this.props.defaultValue
  //     });
  //   }
  // }
  onChange = val => {
    // console.log(val);
    this.setState({
      value: val
    });
  };
  render() {
    const { onSave, onCancel, data, type, cols } = this.props;
    const { value } = this.state;
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          value={value}
          cols={cols}
          onChange={this.onChange}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onCancel={() => onCancel(type)}
          onSave={() => onSave(type, value)}
        />
      </>
    );
  }
}
