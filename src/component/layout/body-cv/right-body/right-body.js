import React from "react";
import skills from "./right-body-data/skill-list";
import hobbies from "./right-body-data/hobby-list";
import { Grid, Icon } from "semantic-ui-react";

function SkillRow(props) {
  const name = props.name;
  const stars = [];
  for (let i = 0; i < props.stars; i++) {
    stars.push(<Icon key={i} name={"star"} color="yellow" />);
  }
  return (
    <Grid>
    <Grid.Row>
      <Grid.Column width={16}>
        <p>
          <b>{name}</b>: {stars}
        </p>
      </Grid.Column>
    </Grid.Row></Grid>
  );
}

class RightBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shortTerm:
        "- Ngắn hạn: Tích luỹ kiến thức, kinh nghiệm, làm quen với môi trường phát triển phần mềm thực tế, thành thạo công việc trong thời gian thực tập",
      longTerm:
        "- Dài hạn: Trở thành full-stack developer, nắm vững chuyên môn của một vài ngôn ngữ chủ đạo. "
    };
  }

  render() {
    const skillList = skills;
    const hobbyList = hobbies;
    return (
      <Grid>
        <Grid.Row style={{ marginTop: 30 }}>
          <Grid.Column width={16}>
            <h4>MỤC TIÊU NGHỀ NGHIỆP</h4>
            <hr
              style={{
                height: 2,
                border: "none",
                color: "#333",
                backgroundColor: "#333"
              }}
            />
            <Grid.Row style={{ marginTop: 25 }}>
              <Grid.Column width={16}>
                <p>{this.state.shortTerm}</p>
                <p>{this.state.longTerm}</p>
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ marginTop: 30 }}>
          <Grid.Column width={16}>
            <h4>KỸ NĂNG</h4>
            <hr
              style={{
                height: 2,
                border: "none",
                color: "#333",
                backgroundColor: "#333"
              }}
            />
            <Grid.Row style={{ marginTop: 25 }}>
              <Grid.Column width={16}>
                {skillList.map((skill, index) => {
                  return <SkillRow key={index} name={skill.name} stars={skill.stars} />;
                })}
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ marginTop: 30 }}>
          <Grid.Column width={16}>
            <h4>SỞ THÍCH</h4>
            <hr
              style={{
                height: 2,
                border: "none",
                color: "#333",
                backgroundColor: "#333"
              }}
            />
            <Grid.Row style={{ marginTop: 25 }}>
              <Grid.Column width={16}>
                {hobbyList.map((hobby, index) => {
                  return <li key={index}>{hobby}</li>;
                })}
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default RightBody;
