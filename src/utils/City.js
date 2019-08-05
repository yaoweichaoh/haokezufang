const HKXF_CITY = "hkzf_city";

// 获取到本地存储的当前位置
export const getCity = () => JSON.parse(localStorage.getItem(HKXF_CITY));

// 当前位置储存到本地
export const setCity = setcity =>
  localStorage.setItem(HKXF_CITY, JSON.stringify(setcity));
