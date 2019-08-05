import React from "react";
import ReactDom from "react-dom";

// 导入 antd-mobile 的样式文件
import "antd-mobile/dist/antd-mobile.css";

// 导入全局样式
import "./index.css";

// 导入icon样式
import "./assets/fonts/iconfont.css";

//  react-virtualized 样式
import "react-virtualized/styles.css";

// 导入组件App
import App from "./App";

ReactDom.render(<App />, document.getElementById("root"));
