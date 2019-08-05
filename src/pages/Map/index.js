import React from "react";

// 导入NavHeader组件
import NavHeader from "../../components/NavHeader";

// 导入utils组件
import { getCurrentCity, BASE_URL, API } from "../../utils";

// 导入HouseItem组件
import HouseItem from "../../components/HouseItem";

// 导入遮罩物组件
import { Toast } from "antd-mobile";

// 导入scss样式
import "./index.scss";
import styles from "./index.module.css";

const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center"
};
const BMap = window.BMap;
export default class Map extends React.Component {
  state = {
    houseList: [],
    isShowHouseList: false
  };
  componentDidMount() {
    this.initMap();
  }

  async initMap() {
    const { label, value } = await getCurrentCity();
    // console.log(label, value);
    // 创建百度地图对象
    // 参数：表示地图容器的id值
    const map = new BMap.Map("container");
    this.map = map;
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async point => {
        if (point) {
          // 设置缩放级别
          map.centerAndZoom(point, 11);

          // map.addOverlay(new BMap.Marker(point));
          // 平移缩放控件
          map.addControl(new BMap.NavigationControl());
          // 比列尺
          map.addControl(new BMap.ScaleControl());
          this.renderOverlays(value);
        }
      },
      label
    );

    // 给百度绑定移除事件
    map.addEventListener("movestart", () => {
      // 隐藏小区房屋列表
      this.setState({
        isShowHouseList: false
      });
    });
  }

  // 获取下级缩放级别以及要渲染的覆盖物类型
  // 思路：根据地图缩放级别，来获取对应的数据
  // 区   -> 11 ，范围：>=10 <12
  // 镇   -> 13 ，范围：>=12 <14
  // 小区 -> 15 ，范围：>=14 <16
  getTypeAndZoom() {
    const curZoom = this.map.getZoom();
    let nextZoom;
    let type;
    if (curZoom >= 10 && curZoom < 12) {
      nextZoom = 13;
      type = "circle";
    } else if (curZoom >= 12 && curZoom < 14) {
      nextZoom = 15;
      type = "circle";
    } else {
      type = "rect";
    }

    return { nextZoom, type };
  }

  async renderOverlays(id) {
    Toast.loading("加载中...", 0, null, false);
    const res = await API.get(`/area/map`, {
      params: {
        id
      }
    });
    // console.log(res);
    const { nextZoom, type } = this.getTypeAndZoom();
    res.data.body.forEach(item => {
      this.createOverlays(nextZoom, type, item);
    });

    Toast.hide();
  }

  // 创建覆盖物
  createOverlays(nextZoom, type, item) {
    const {
      label,
      value,
      count,
      coord: { longitude, latitude }
    } = item;
    // 声明覆盖物的坐标
    const point = new BMap.Point(longitude, latitude);

    if (type === "rect") {
      //  小区
      this.createRect(point, label, value, count);
    } else {
      // 区  镇
      this.createCircle(point, label, count, value, nextZoom);
    }
  }

  //  区 镇
  createCircle(point, name, count, id, zoom) {
    let opts = {
      // 要创建的 覆盖物 的坐标
      position: point,
      offset: new BMap.Size(-35, -35) //设置文本偏移量
    };
    let label = new BMap.Label("", opts); // 创建文本标注对象
    // console.log(label);
    label.setContent(`
             <div class="${styles.bubble}">
               <p class="${styles.name}">${name}</p>
               <p>${count}套</p>
             </div>
           `);

    // 创建覆盖物点击事件
    label.addEventListener("click", () => {
      // console.log("覆盖物被点击了", value);
      this.renderOverlays(id);
      setTimeout(() => {
        //清除覆盖物
        this.map.clearOverlays();
      }, 0);
      //  缩放级别
      this.map.centerAndZoom(point, zoom);
    });

    label.setStyle(labelStyle);
    this.map.addOverlay(label);
  }

  // 小区
  createRect(point, name, id, count) {
    let opts = {
      // 要创建的 覆盖物 的坐标
      position: point,
      offset: new BMap.Size(-50, -24) //设置文本偏移量
    };
    let label = new BMap.Label("", opts); // 创建文本标注对象
    // console.log(label);
    label.setContent(`
            <div class="${styles.rect}">
            <span class="${styles.housename}">${name}</span>
            <span class="${styles.housenum}">${count}套</span>
            <i class="${styles.arrow}"></i>
           </div>
           `);

    // 创建覆盖物点击事件
    label.addEventListener("click", e => {
      // console.log("覆盖物被点击了", value);
      // 计算地图偏移数据
      const { pageX, pageY } = e.changedTouches[0];
      // console.log(e.changedTouches);
      const x = window.innerWidth / 2 - pageX;
      const y = (window.innerHeight - 375 + 45) / 2 - pageY;
      // 百度地图提供的偏移方法
      this.map.panBy(x, y);
      this.getCommunityHouses(id);
    });

    label.setStyle(labelStyle);
    this.map.addOverlay(label);
  }

  async getCommunityHouses(id) {
    Toast.loading("加载中...", 0, null, false);
    const res = await API.get(`/houses`, {
      params: {
        cityId: id
      }
    });
    Toast.hide();

    console.log(res);
    this.setState({
      houseList: res.data.body.list,
      isShowHouseList: true
    });
  }

  // 小区房屋列表渲染
  renderHouseList() {
    return this.state.houseList.map(item => (
      <HouseItem
        {...item}
        houseImg={`${BASE_URL}${item.houseImg}`}
        key={item.houseCode}
      />
    ));
  }
  render() {
    return (
      <div className="map">
        <NavHeader>地图找房</NavHeader>
        <div id="container" className="container" />

        <div
          className={[
            styles.houseList,
            this.state.isShowHouseList ? styles.show : ""
          ].join(" ")}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>{this.renderHouseList()}</div>
        </div>
      </div>
    );
  }
}
