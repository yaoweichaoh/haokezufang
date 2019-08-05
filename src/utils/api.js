// 导入axlos
import axios from "axios";

import { getToken, removeToken } from "./Token";
/* 
① 在 api.js 中，添加请求拦截器。
② 获取到当前请求的接口路径（url）。
③ 判断接口路径，是否是以 /user 开头，并且不是登录或注册接口（只给需要的接口添加请求头）。
④ 如果是，就添加请求头 Authorization。
⑤ 添加响应拦截器。
⑥ 判断返回值中的状态码。
⑦ 如果是 400，表示 token 超时或异常，直接移除 token
*/
import { BASE_URL } from "./url";
const API = axios.create({
  baseURL: BASE_URL
});

// 添加拦截器
API.interceptors.request.use(config => {
  // console.log(config);
  const { url } = config;

  if (
    url === "/user" &&
    !(url === "/user/login" || url === "/user//user/registered")
  ) {
    // 是否是以 /user 开头，并且不是登录或注册接口的 添加请求头
    config.headers.authorization = getToken();
  }
  return config;
});

// 设置响应拦截器
API.interceptors.response.use(res => {
  // console.log(res);

  if (res.data.status === 400) {
    // 失败  移除Token
    removeToken();
  }
  return res;
});
export { API };
