import React, { Component } from 'react';
import Header from './header'
import Footer from './footer'
import Img1 from '../../../images/carousel_1.jpg'
import Img2 from '../../../images/carousel_2.jpg'
import Img3 from '../../../images/carousel_3.jpg'
import Img4 from '../../../images/carousel_4.jpg'
import MobileList from './mobile_list';
import {Tabs, Carousel} from 'antd';
const TabPane = Tabs.TabPane;
class Index extends Component {
    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            autoplay: true
        };
        return (
          <div>
              <Header></Header>
              <Tabs>
                  <TabPane tab="头条" key="1">
                      <div class="carousel">
                          <Carousel {...settings}>
                              <div><img src={Img1}/></div>
                              <div><img src={Img2}/></div>
                              <div><img src={Img3}/></div>
                              <div><img src={Img4}/></div>
                          </Carousel>
                      </div>
                      <MobileList count={20} type="top"/>
                  </TabPane>
                  <TabPane tab="社会" key="2">
                      <MobileList count={20} type="shehui"/>
                  </TabPane>
                  <TabPane tab="国内" key="3">
                      <MobileList count={20} type="guonei"/>
                  </TabPane>
                  <TabPane tab="国际" key="4">
                      <MobileList count={20} type="guoji"/>
                  </TabPane>
                  <TabPane tab="娱乐" key="5">
                      <MobileList count={20} type="yule"/>
                  </TabPane>
              </Tabs>
              <Footer></Footer>
          </div>
        );
    }
}

export default Index;
