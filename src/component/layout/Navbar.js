import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import {
  Grid,
  Menu
} from "semantic-ui-react";

class Navbar extends Component {
  render() {
    return (
      <Grid padded>
        <Menu borderless inverted fluid>
          <Menu.Item header as="a">
            Tung Le
          </Menu.Item>
        </Menu>
      </Grid>
    );
  }
}

export default Navbar;
