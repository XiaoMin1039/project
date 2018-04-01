import React, {Component} from 'react';
import PCIndex from "./js/components/pc/index"
import PCNewsDetails from "./js/components/pc/news_details"
import PCUserCenter from "./js/components/pc/user_center"
import 'antd/dist/antd.css';
import MediaQuery from 'react-responsive';
import MobileIndex from "./js/components/mobile/index"
import MobileNewsDetails from "./js/components/mobile/news_details"
import MobileUserCenter from "./js/components/mobile/user_center"
import 'antd/dist/antd.css';
import './css/pc.css'
import './css/mobile.css'
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div>
                <MediaQuery query='(min-device-width: 1224px)'>
                <Router path="/">
                    <div>
                        <Route exact  path="/" component={PCIndex}></Route>
                        <Route path="/details/:uniquekey" component={PCNewsDetails}></Route>
                        <Route path="/usercenter" component={PCUserCenter}></Route>
                    </div>
                </Router>
                </MediaQuery>
                <MediaQuery query='(max-device-width: 1224px)'>
                    <Router path="/">>
                        <div>
                            <Route exact  path="/" component={MobileIndex}></Route>
                            <Route path="/details/:uniquekey" component={MobileNewsDetails}></Route>
                            <Route path="/usercenter" component={MobileUserCenter}></Route>
                        </div>
                    </Router>
                </MediaQuery>
            </div>
        );
    }
}

export default App;
