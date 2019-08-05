import React from "react";

/* 
  1 导入 react-router-dom 中的三个组件
  2 导入页面组件
  3 配置路由规则
*/

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// 导入页面组件
import Home from "./pages/Home";
import CityList from "./pages/CityList";
import Details from "./pages/Details";
import Login from "./pages/Login";

// 导入map页面
import Map from "./pages/Map";

// 创建App组件
const App = () => {
  return (
    <Router>
      <div className="app">
        {/* 重定向  Redirect 组件用于实现路由重定向，to 属性指定要跳转到的路由地址*/}
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        {/* 首页 */}
        <Route path="/home" component={Home} />
        {/* 城市选择页面 */}
        <Route path="/citylist" component={CityList} />
        {/* map页面 */}
        <Route path="/map" component={Map} />
        {/* Detail页面 */}
        <Route path="/detail" component={Details} />
        {/* Login页面 */}
        <Route path="/login" component={Login} />
      </div>
    </Router>
  );
};

// 到出App组件
export default App;
