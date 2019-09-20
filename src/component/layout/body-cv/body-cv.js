import React from "react";
import MainBody from "./main-body/main-body";
import RightBody from "./right-body/right-body";
import { Grid } from "semantic-ui-react";
class BodyCV extends React.Component {
  render() {
    return (
      <Grid>
        <Grid.Row className="row" style={{ marginBottom: 50 }}>
          <Grid.Column width={10}>
            <MainBody />
          </Grid.Column>
          <Grid.Column width={6}>
            <RightBody />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default BodyCV;
