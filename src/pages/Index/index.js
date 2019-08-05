import React from "react";

// 导入封装组件
import { getCurrentCity, BASE_URL, API } from "../../utils";
// 导入轮播图组件
import { Carousel, Flex, Grid } from "antd-mobile";

import SearchHeader from "../../components/SearchHeader";

// 导入scss
import "./index.scss";

// 导入图片
import nav1 from "../../assets/images/nav-1.png";
import nav2 from "../../assets/images/nav-2.png";
import nav3 from "../../assets/images/nav-3.png";
import nav4 from "../../assets/images/nav-4.png";

// 导入link
import { Link } from "react-router-dom";

export default class Index extends React.Component {
  state = {
    // 轮播图数据
    swipers: [],
    // 租房数据
    groups: [],
    // 最新资讯数据
    news: [],
    // 轮播图高度
    imgHeight: 212,

    // 根据城市名称查询该城市信息
    city: "定位中...",

    isSwiperLoading: true
  };

  // 轮播图axios请求
  async getSwipers() {
    const res = await API.get("/home/swiper");
    // console.log(res);
    this.setState({
      swipers: res.data.body,

      //  表示轮播图数据加载完成
      isSwiperLoading: false
    });
  }

  // 租房请求
  async getGroups() {
    const res = await API.get("/home/groups?area=AREA%7C88cff55c-aaa4-e2e0");
    // console.log(res);
    this.setState({
      groups: res.data.body
    });
  }

  // 最新资讯请求
  async getNews() {
    const res = await API.get("/home/news?area=AREA%7C88cff55c-aaa4-e2e0");
    // console.log(res);
    this.setState({
      news: res.data.body
    });
  }

  // 最新资讯渲染
  renderNews = () => {
    return this.state.news.map(item => (
      <Flex className="am-fiexbox" justify="between" key={item.id}>
        <div className="boximg">
          <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
        </div>
        <div className="am-title">
          <h3>{item.title}</h3>
          <Flex justify="between" className="am-span">
            <span>{item.date}</span>
            <span>{item.from}</span>
          </Flex>
        </div>
      </Flex>
    ));
  };

  async componentDidMount() {
    // console.log(11);
    this.getSwipers();
    this.getGroups();
    this.getNews();

    const { label } = await getCurrentCity();
    this.setState({
      city: label
    });
  }

  renderSwipers = () => {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://baidu.com"
        style={{
          display: "inline-block",
          width: "100%",
          height: this.state.imgHeight
        }}
      >
        <img
          src={`${BASE_URL}${item.imgSrc}`}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event("resize"));
            this.setState({ imgHeight: "auto" });
          }}
        />
      </a>
    ));
  };
  render() {
    //autoplay 是否自动切换
    return (
      <div className="index">
        <div className="swiper">
          <SearchHeader cityName={this.state.city} />
          {this.state.isSwiperLoading ? null : (
            <Carousel autoplay={true} infinite autoplayInterval={4000}>
              {this.renderSwipers()}
            </Carousel>
          )}
        </div>
        <Flex className="nav">
          <Flex.Item>
            <Link to="/home/list">
              <img src={nav1} alt="" />
              <p>整租</p>
            </Link>
          </Flex.Item>
          <Flex.Item>
            <Link to="/home/list">
              <img src={nav2} alt="" />
              <p>合租</p>
            </Link>
          </Flex.Item>
          <Flex.Item>
            <Link to="/home/list">
              <img src={nav3} alt="" />
              <p>地图找房</p>
            </Link>
          </Flex.Item>
          <Flex.Item>
            <Link to="/home/list">
              <img src={nav4} alt="" />
              <p>去出租</p>
            </Link>
          </Flex.Item>
        </Flex>
        <div className="group">
          <Flex className="renting" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
          <Grid
            data={this.state.groups}
            columnNum={2}
            hasLine={false}
            square={false}
            activeStyle
            className="rentingNav"
            renderItem={item => (
              <Flex justify="between">
                <div className="title">
                  <p>{item.title}</p>
                  <span>{item.desc}</span>
                </div>
                <div className="imgs">
                  <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
                </div>
              </Flex>
            )}
          />
        </div>

        <div className="news">
          <div className="news-title">
            <h3>最新资讯</h3>
          </div>
          {this.renderNews()}
        </div>
      </div>
    );
  }
}
