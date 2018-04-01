import React, {Component} from 'react';
import {Row, Col, Tabs, Carousel} from 'antd';
import NewsBlock from './news_block'
import NewsImageBlock from './news_image_block'
import Img1 from '../../../images/carousel_1.jpg'
import Img2 from '../../../images/carousel_2.jpg'
import Img3 from '../../../images/carousel_3.jpg'
import Img4 from '../../../images/carousel_4.jpg'

const TabPane = Tabs.TabPane;

class Container extends Component {
    render() {
        const setting = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
        }
        return (
            <Row>
                <Col span={2}></Col>
                <Col span={20}>
                    <div class="leftContainer">
                        <div class="carousel">
                            <Carousel effect="fade" autoplay  {...setting}>
                                <div><img src={Img1}/></div>
                                <div><img src={Img2}/></div>
                                <div><img src={Img3}/></div>
                                <div><img src={Img4}/></div>
                            </Carousel>
                        </div>
                        <NewsImageBlock count={6} type="guoji" width="400px" cartTitle="国际头条" imageWidth="112px"/>
                    </div>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="头条新闻" key="1">
                            <NewsBlock count={22} type="top" width="100%" bordered="false"></NewsBlock>
                        </TabPane>
                        <TabPane tab="国际" key="2">
                            <NewsBlock count={22} type="guoji" width="100%" bordered="false"></NewsBlock>
                        </TabPane>
                    </Tabs>
                    <div>
                        <NewsImageBlock count={8} type="guonei" width="100%" cartTitle="国内新闻" imageWidth="132px"/>
                        <NewsImageBlock count={16} type="yule" width="100%" cartTitle="娱乐新闻" imageWidth="132px"/>
                    </div>
                </Col>
                <Col span={2}></Col>
            </Row>
        );
    }
}

export default Container;
