import React from "react";
import sectionList from "./main-body-data/section-list";
import MainSection from "./main-section";
import {Grid} from "semantic-ui-react"
class MainBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linkedIn: "- LinkedIn: https://www.linkedin.com/in/tung-le-a613a716b/",
      github: "- Github: https://github.com/ZaffranLe"
    };
  }

  render() {
    const list = sectionList;
    return (
      <>
        {list.map((item, index) => {
          return <MainSection key={index} title={item.title} list={item.list} />;
        })}
        <Grid>
          <Grid.Row style={{ marginTop: 30 }}>
            <Grid.Column width={16}>
              <h4>THÔNG TIN THÊM</h4>
              <hr style={{ height: 2, border: "none", color: "#333", backgroundColor: "#333" }} />
              <Grid.Row style={{ marginTop: 25 }}>
                <Grid.Column width={16}>
                  <p>{this.state.linkedIn}</p>
                  <p>{this.state.github}</p>
                  <p>- Câu nói ưa thích: "Làm những gì mình thích và thích những gì mình làm"</p>
                  <p>- Có khả năng tự học, tìm hiểu</p>
                  <p>- Tự nhận xét bản thân là 1 người thẳng thắn, nghiêm túc</p>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

export default MainBody;
