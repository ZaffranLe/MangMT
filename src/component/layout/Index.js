import React from "react";
import HeaderCV from "./header-cv/header-cv";
import BodyCV from "./body-cv/body-cv";
import { Grid } from "semantic-ui-react";

export default () => {
  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column width={9}>
          <Grid.Row>
            <Grid.Column id="CV" width={16}>
              <Grid.Row>
                <Grid.Column width={14}>
                  <HeaderCV />
                  <hr
                    style={{
                      height: 5,
                      border: "none",
                      color: "#333",
                      backgroundColor: "#333"
                    }}
                  />
                  <BodyCV />
                  <hr
                    style={{
                      height: 5,
                      border: "none",
                      color: "#333",
                      backgroundColor: "#333"
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
