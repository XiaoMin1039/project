import React, {Component} from 'react';
import {Card} from 'antd';
import {
    Link
} from 'react-router-dom';

class NewsImageBlock extends Component {
    constructor() {
        super();
        this.state = {
            news: ''
        }
    }

    componentWillMount() {
        var myFetchOptions = {
            method: "Get"
        };
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type=" + this.props.type + "&count=" + this.props.count, myFetchOptions)
            .then(response => response.json())
            .then(json => this.setState({news: json}));
    }

    render() {
        const styleImage = {
            display: "block",
            width: this.props.imageWidth,
            height: "90px"
        };
        const styeH3 = {
            width: this.props.imageWidth,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        };
        const {news} = this.state;
        const newsList = news.length
            ? news.map((newsItem, index) => (
                <li key={index} className="imageblock">
                    <Link to={`details/${newsItem.uniquekey}`} target="_blank">
                        <div className="custom-image">
                            <img alt="" style={styleImage} src={newsItem.thumbnail_pic_s}/>
                        </div>
                        <div className="custom-card">
                            <h3 style={styeH3}>{newsItem.title}</h3>
                            <p>{newsItem.author_name}</p>
                        </div>
                    </Link>
                </li>
            ))
            : "没有加载到任何新闻";
        return (
            <div class="topNewsList">
                <Card title={this.props.cartTitle} bordered={true} style={{
                    width: this.props.width
                }}>
                    <ul>
                        {newsList}
                    </ul>
                </Card>
            </div>
        );
    }
}

export default NewsImageBlock;
