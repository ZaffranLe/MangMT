import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import { Grid } from "semantic-ui-react";
import Navbar from "./component/layout/Navbar";
import SideMenu from "./component/layout/SideMenu";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Routes from "./routes";
class App extends Component {
  state = {
    dropdownMenuStyle: {
      display: "none"
    }
  };

  handleToggleDropdownMenu = () => {
    let newState = Object.assign({}, this.state);
    if (newState.dropdownMenuStyle.display === "none") {
      newState.dropdownMenuStyle = { display: "flex" };
    } else {
      newState.dropdownMenuStyle = { display: "none" };
    }

    this.setState(newState);
  };

  render() {
    return (
      <div className="App">
        <Router>
          <Grid padded>
            <Grid.Column width={2}>
              <SideMenu />
            </Grid.Column>
            <Grid.Column width={14} floated="right" id="content">
              <Routes />
            </Grid.Column>
          </Grid>
          <ToastContainer />
        </Router>
      </div>
    );
  }
}

export default App;
