import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Sidebar, Icon } from "semantic-ui-react";

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: ""
    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (
      <Sidebar
        as={Menu}
        animation="push"
        icon="labeled"
        inverted
        vertical
        visible={true}
        width="thin"
      >
        <Link to="/">
          <Menu.Item as="a">
            <Icon name="home" />
            Home
          </Menu.Item>
        </Link>
        <Link to="/feature/dijkstra">
          <Menu.Item
            name="dijkstra"
            active={activeItem === "dijkstra"}
            onClick={this.handleItemClick}
          >
            Dijkstra / Bellman-Ford
          </Menu.Item>
        </Link>
        <Link to="/feature/binary-algorithms">
          <Menu.Item
            name="binary-algorithms"
            active={activeItem === "binary-algorithms"}
            onClick={this.handleItemClick}
          >
            Binary algorithms
          </Menu.Item>
        </Link>
        <Link to="/feature/ip-subnet-v4">
          <Menu.Item
            name="ip-subnet-v4"
            active={activeItem === "ip-subnet-v4"}
            onClick={this.handleItemClick}
          >
            IPv4 Subnet
          </Menu.Item>
        </Link>
        <Link to="/feature/schedule">
          <Menu.Item
            name="schedule"
            active={activeItem === "schedule"}
            onClick={this.handleItemClick}
          >
            NOC NET Schedule
          </Menu.Item>
        </Link>
      </Sidebar>
    );
  }
}

export default SideMenu;
