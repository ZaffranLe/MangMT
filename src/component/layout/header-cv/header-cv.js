import React from "react";
import { Grid, Icon, Header, Image } from "semantic-ui-react";
var avatar = require("./avatar.jpg");

function AddressRow(props) {
  return (
    <>
      <Icon style={{ width: 25 }} name={props.icon} /> :{"  "}
      <span>{props.info}</span>
    </>
  );
}

class HeaderCV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myName: "Lê Sơn Tùng",
      myPosition: "Intern Developer",
      myAddress: "Thuỵ Khuê, quận Tây Hồ, Hà Nội",
      myEmail: "stungle154@gmail.com",
      myPhone: "+84829093384"
    };
  }

  render() {
    return (
      <Grid>
        <Grid.Row style={{ marginTop: 25, marginBottom: 25 }}>
          <Grid.Column width={3}>
            <Image src={avatar} circular alt="My pic" />
          </Grid.Column>
          <Grid.Column width={6}>
            <Header>{this.state.myName}</Header>
            <p>
              <i>{this.state.myPosition}</i>
            </p>
          </Grid.Column>
          <Grid.Column width={7} textAlign="right">
            <address>
              <AddressRow icon={"home"} info={this.state.myAddress} />
              <br />
              <AddressRow icon={"envelope"} info={this.state.myEmail} />
              <br />
              <AddressRow icon={"phone"} info={this.state.myPhone} />
            </address>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default HeaderCV;
