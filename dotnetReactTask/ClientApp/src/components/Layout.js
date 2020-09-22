import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenuComponent/NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div style={{ height: '100%' }}>
        <NavMenu />
        <Container style={{ height: 'calc(100% - 73px)' }}>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
