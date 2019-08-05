import React from "react";

import { NavBar } from "antd-mobile";

// 导入peop-types校验
import PropTypes from "prop-types";

// 导入高阶组件，获取路由信息
import { withRouter } from "react-router-dom";

// 导入自己样式
import styles from "./index.module.scss";

function NavHeader({ children, history, className, rightContent }) {
  return (
    <NavBar
      className={[styles.navbar, className].join("")}
      mode="light"
      icon={<i className="iconfont icon-back" onClick={() => history.go(-1)} />}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  );
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired
};

export default withRouter(NavHeader);
