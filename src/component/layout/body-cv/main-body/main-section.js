import React from "react";
import { Grid, Icon } from "semantic-ui-react";

function Item(props) {
  const list = props.list;
  return (
    <Grid>
      <Grid.Row style={{ marginTop: 25 }} divided>
        <Grid.Column width={3}>
          {list.start}
          <br />
          <Icon name="arrow down" />
          <br />
          {list.end}
        </Grid.Column>
        <Grid.Column width={13}>
          <h5>{list.title}</h5>
          <span className="text-info">{list.subTitle}</span>
          <br />
          <span>{list.info}</span>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

class MainSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      list: props.list
    };
  }

  render() {
    const list = this.state.list;
    const title = this.state.title;
    return (
      <Grid>
        <Grid.Row style={{ marginTop: 30 }}>
          <Grid.Column width={16}>
            <h4>{title}</h4>
            <hr style={{ height: 2, border: "none", color: "#333", backgroundColor: "#333" }} />
            {list.map((item, index) => {
              return <Item key={index} list={item} />;
            })}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default MainSection;
