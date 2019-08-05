import React from "react";

// 导入TabBar组件
import { TabBar } from "antd-mobile";

import "./index.css";

import { Route } from "react-router-dom";
// // 导入该页面中的子页面
import Index from "../Index";
import HouseList from "../HouseList";
import News from "../News";
import Profile from "../Profile";

const TABBARLIST = [
  { title: "首页", icon: "icon-ind", path: "/home" },
  { title: "找房", icon: "icon-findHouse", path: "/home/list" },
  { title: "资讯", icon: "icon-infom", path: "/home/news" },
  { title: "我的", icon: "icon-my", path: "/home/profile" }
];

export default class Home extends React.Component {
  // 2 拷贝状态
  state = {
    // 指定当前选中的 tab 菜单
    selectedTab: this.props.location.pathname,
    // 指定 TabBar 组件是否全屏显示
    fullScreen: true
  };

  componentDidUpdate(prveProps) {
    // console.log(this.props);
    // console.log(prveProps);
    const propsPath = this.props.location.pathname;
    const prvePropspath = prveProps.location.pathname;
    if (propsPath !== prvePropspath) {
      this.setState({
        selectedTab: propsPath
      });
    }
  }
  renderTabBarItems = () => {
    return TABBARLIST.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          console.log(this.props.history);
          this.props.history.push(item.path);
        }}
      />
    ));
  };
  render() {
    return (
      <div className="home-box">
        <Route exact path="/home" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />

        {/* TabBar 组件的示例代码： */}
        <div className="home">
          {/* 
            unselectedTintColor 指定：未选中 tabbar 菜单的文字颜色
            tintColor 指定：选中 tabbar 菜单的文字颜色
            barTintColor 指定：tabbar 的背景色
          */}
          <TabBar tintColor="#21B97A" noRenderContent={true}>
            {/* 
              title 指定：当前 tabbar 菜单项的标题
              icon 指定：当前 tabbar 菜单项的图标
              selectedIcon 指定：当前 tabbar 菜单项选中的图标
              selected 指定：当前菜单项是否选中
              onPress 指定：单击事件
              badge 指定：徽标数
            */}
            {this.renderTabBarItems()}
          </TabBar>
        </div>
      </div>
    );
  }
}
