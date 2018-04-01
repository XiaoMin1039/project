import React, { Component } from 'react';
import Header from './header'
import Container from './container'
import Footer from './footer'

class Index extends Component {
    render() {
        return (
          <div>
              <Header></Header>
              <Container></Container>
              <Footer></Footer>
          </div>
        );
    }
}

export default Index;
