import React, {Component} from 'react';
import { Row, Col,BackTop } from 'antd';
import NewsImageBlock from './news_image_block'
import Comments from './comments'
import Header from './header'
import Footer from './footer'
class NewsDetails extends Component {
    constructor() {
        super();
        this.state = {
            newsItem:''
        }
    }
    componentDidMount() {
        var myFetchOptions = {
            method: 'GET'
        };
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey=" + this.props.match.params.uniquekey, myFetchOptions).then(response => response.json()).then(json => {
            this.setState({newsItem: json});
            document.title = this.state.newsItem.title + " - React News | React 驱动的新闻平台";
        });
    };
    createMarkup() {
        return {__html: this.state.newsItem.pagecontent}
    }
    render() {
        return (
            <div>
                <Header></Header>
                <Row>
                    <Col span={2}></Col>
                    <Col span={14} className="container">
                        <div class="articleContainer" dangerouslySetInnerHTML={this.createMarkup()}></div>
                        <hr/>
                        <Comments uniquekey={this.props.match.params.uniquekey}/>
                    </Col>
                    <Col span={6}>
                        <NewsImageBlock count={40} type="top" width="100%" cardTitle="相关新闻" imageWidth="150px"/>
                    </Col>
                    <Col span={2}></Col>
                </Row>
                <Footer></Footer>
                <BackTop />
            </div>
        );
    }
}

export default NewsDetails;
