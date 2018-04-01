import React, {Component} from 'react';
import { Row, Col} from 'antd';
class Footer extends Component {
    render() {
        return (
            <Row>
                <Col span={2}></Col>
                <Col span={20} class="footer">
                    &copy;&nbsp;20xx ReactNews. All Rights Reserved.
                </Col>
                <Col span={2}></Col>
            </Row>
        );
    }
}

export default Footer;
