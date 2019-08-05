import axios from "axios";

import { getCity, setCity } from "./City";

const BMap = window.BMap;
const getCurrentCity = () => {
  const curCity = getCity();
  // 判断本地储存中是否有定位信息
  if (!curCity) {
    // 封装异步操作 如果异步成功，就调用resolve，把数据暴露出去
    return new Promise(resolve => {
      var myCity = new BMap.LocalCity();
      myCity.get(async result => {
        var cityName = result.name;

        const res = await axios.get("http://localhost:8080/area/info", {
          params: {
            name: cityName
          }
        });

        // console.log(res);
        const { label, value } = res.data.body;

        // 通过resolve 把数据暴露出去
        resolve({ label, value });

        // this.setState({
        //   city: label
        // });
        // 将获取到的城市信息存到本地缓存中
        setCity({ label, value });
      });
    });
  } else {
    return Promise.resolve(curCity);
  }
};

export { getCurrentCity, getCity, setCity };

// 导出和导入 图片的url地址
export { BASE_URL } from "./url";

// 导出和导入  axios的url地址
export { API } from "./api";

// 导入和导出 Token
export { getToken, setToken, removeToken, isAuth } from "./Token";
