import React, { Component } from "react";

import {
  Segment,
  Header,
  Grid,
  Image,
  Modal,
  Input,
  Form,
  Button,
  Divider,
  Dropdown,
  Select,
  Statistic
} from "semantic-ui-react";
import udpChecksum from "./udp-checksum-algorithm";
import { hammingCode, fixHammingCode } from "./hamming-algorithm";
import crcCalculate from "./crc-algorithm";
const hammingCodeExample = require("./hamming-code-example.jpg");
const crcExample = require("./crc-example.png");

const options = [
  {
    key: "binary",
    text: "Binary",
    value: "bin"
  },
  {
    key: "word",
    text: "Word",
    value: "word"
  }
];

class ImageModal extends Component {
  render() {
    const { img, imgModal, handleCloseModal } = this.props;
    return (
      <Modal onClose={handleCloseModal} open={imgModal} size="large">
        <Modal.Content>
          <Image src={img} bordered fluid />
        </Modal.Content>
      </Modal>
    );
  }
}

class BinaryAlgorithms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgModal: false,
      img: "",
      udpChecksum: {
        word: "",
        result: "",
        stepIdx: 0
      },
      hammingCode: {
        input: "",
        type: "word",
        result: "",
        hammingCode: "",
        resultFix: ""
      },
      crc: {
        word: "",
        type: "word",
        result: "",
        g: ""
      }
    };
  }

  handleZoomImage = img => {
    this.setState({
      imgModal: true,
      img
    });
  };

  handleCloseModal = () => {
    this.setState({
      imgModal: false
    });
  };

  handleChangeInput = e => {
    const algorithm = e.target.parentElement.dataset.algorithm;
    const name = e.target.parentElement.dataset.name;
    this.setState({
      [algorithm]: {
        ...this.state[algorithm],
        [name]: e.target.value
      }
    });
  };

  calculateUDPChecksum = () => {
    const result = udpChecksum(this.state.udpChecksum.word);
    this.setState({
      udpChecksum: {
        ...this.state.udpChecksum,
        result
      }
    });
  };

  handleChangeOption = (e, data) => {
    const { algorithm, value } = data;
    this.setState({
      [algorithm]: {
        ...this.state[algorithm],
        type: value
      }
    });
  };

  calculateHammingCode = () => {
    const hamming = this.state.hammingCode;
    const result = hammingCode(hamming.input, hamming.type);
    this.setState({
      hammingCode: {
        ...this.state.hammingCode,
        result
      }
    });
  };

  fixHammingCode = () => {
    const resultFix = fixHammingCode(this.state.hammingCode.hammingCode);
    this.setState({
      hammingCode: {
        ...this.state.hammingCode,
        resultFix
      }
    });
  };

  calculateCrc = () => {
    const { crc } = this.state;
    const result = crcCalculate(crc.word, crc.type, crc.g);
    this.setState({
      crc: {
        ...crc,
        result
      }
    });
  };

  selectUdpStep = (e, data) => {
    this.setState({
      udpChecksum: {
        ...this.state.udpChecksum,
        stepIdx: data.value
      }
    });
  };

  render() {
    const { img, imgModal, udpChecksum, hammingCode, crc } = this.state;
    let udpSteps = [];
    if (Boolean(udpChecksum.result["steps"])) {
      udpChecksum.result["steps"].forEach((step, idx) => {
        let obj = {};
        obj["key"] = idx;
        obj["value"] = idx;
        obj["text"] = "Step " + (idx + 1);
        udpSteps.push(obj);
      });
    }
    return (
      <>
        <Segment color="black">
          <Header>BinaryAlgorithms</Header>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Segment color="black">
                      <Header>UDP Checksum Algorithm</Header>
                    </Segment>
                    <Segment>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={16}>
                            <Grid.Row>
                              <Grid.Column width={16}>
                                <Form>
                                  <Form.Field>
                                    <Input
                                      label="Word"
                                      data-name="word"
                                      data-algorithm="udpChecksum"
                                      value={udpChecksum.word}
                                      fluid
                                      size="large"
                                      onChange={this.handleChangeInput}
                                    />
                                  </Form.Field>
                                  <Form.Field>
                                    <Button
                                      color="teal"
                                      content={
                                        udpChecksum.word
                                          ? "Calculate UDP checksum 16-bit"
                                          : "Input a word first"
                                      }
                                      icon="calculator"
                                      fluid
                                      onClick={this.calculateUDPChecksum}
                                      disabled={!udpChecksum.word}
                                    />
                                  </Form.Field>
                                  <Form.Field>
                                    <Input
                                      label="Result"
                                      data-name="result"
                                      data-algorithm="udpChecksum"
                                      value={udpChecksum.result["checksum"]}
                                      fluid
                                      size="large"
                                    />
                                  </Form.Field>
                                </Form>
                              </Grid.Column>
                            </Grid.Row>
                            <Divider />
                            {Boolean(udpChecksum.result["steps"]) && (
                              <Segment>
                                <Select defaultValue={0} options={udpSteps} onChange={this.selectUdpStep} />
                              </Segment>
                            )}
                            {Boolean(udpChecksum.result["steps"]) && (
                              <Segment>
                                <Statistic.Group horizontal size="small">
                                  {Boolean(udpChecksum.result["steps"]) && (
                                    <>
                                      <Statistic>
                                        <Statistic.Value>
                                          {
                                            udpChecksum.result["steps"][udpChecksum.stepIdx][
                                              "first"
                                            ]
                                          }
                                        </Statistic.Value>
                                      </Statistic>
                                      <Statistic>
                                        <Statistic.Value>
                                          {
                                            udpChecksum.result["steps"][udpChecksum.stepIdx][
                                              "second"
                                            ]
                                          }
                                        </Statistic.Value>
                                      </Statistic>
                                      <Statistic>
                                        <Statistic.Value>
                                          -----------------------------------
                                        </Statistic.Value>
                                      </Statistic>
                                      <Statistic>
                                        <Statistic.Value>
                                          {
                                            udpChecksum.result["steps"][udpChecksum.stepIdx][
                                              "result"
                                            ]
                                          }
                                        </Statistic.Value>
                                      </Statistic>
                                    </>
                                  )}
                                </Statistic.Group>
                              </Segment>
                            )}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={8}>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Segment color="black">
                      <Header>Hamming Code Algorithm</Header>
                    </Segment>
                    <Segment>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={6}>
                            <Form>
                              <Form.Field>
                                <Input
                                  data-name="input"
                                  data-algorithm="hammingCode"
                                  value={hammingCode.input}
                                  size="large"
                                  fluid
                                  onChange={this.handleChangeInput}
                                  label={
                                    <Dropdown
                                      defaultValue="word"
                                      algorithm="hammingCode"
                                      onChange={this.handleChangeOption}
                                      options={options}
                                    />
                                  }
                                  labelPosition="left"
                                />
                              </Form.Field>
                              <Form.Field>
                                <Button
                                  color="teal"
                                  content={
                                    hammingCode.input
                                      ? "Calculate Hamming code of " + hammingCode.input
                                      : "You need to provide input first"
                                  }
                                  icon="calculator"
                                  fluid
                                  onClick={this.calculateHammingCode}
                                  disabled={!hammingCode.input}
                                />
                              </Form.Field>
                              <Form.Field>
                                <Input
                                  label="Result"
                                  data-name="result"
                                  data-algorithm="hammingCode"
                                  value={hammingCode.result}
                                  fluid
                                  size="large"
                                />
                              </Form.Field>
                            </Form>
                          </Grid.Column>
                          <Grid.Column width={10}>
                            <Image
                              src={hammingCodeExample}
                              bordered
                              fluid
                              onClick={() => this.handleZoomImage(hammingCodeExample)}
                            />
                          </Grid.Column>
                        </Grid.Row>
                        <Divider />
                        <Grid.Row>
                          <Grid.Column width={8}>
                            <Form>
                              <Form.Field>
                                <Input
                                  label="Hamming code"
                                  data-name="hammingCode"
                                  data-algorithm="hammingCode"
                                  value={hammingCode.hammingCode}
                                  size="large"
                                  fluid
                                  onChange={this.handleChangeInput}
                                />
                              </Form.Field>
                              <Form.Field>
                                <Button
                                  color="teal"
                                  content="Fix hamming Code"
                                  icon="calculator"
                                  fluid
                                  onClick={this.fixHammingCode}
                                  disabled={!hammingCode.hammingCode}
                                />
                              </Form.Field>
                            </Form>
                          </Grid.Column>
                          <Grid.Column width={8}>
                            <Form>
                              <Form.Field>
                                <Input
                                  label="Result"
                                  data-name="hammingCode"
                                  data-algorithm="hammingCode"
                                  value={
                                    typeof hammingCode.resultFix == "object"
                                      ? hammingCode.resultFix["hammingCode"]
                                      : ""
                                  }
                                  fluid
                                  size="large"
                                />
                              </Form.Field>
                              <Form.Field>
                                <Input
                                  label="Original character"
                                  data-name="char"
                                  data-algorithm="hammingCode"
                                  value={
                                    typeof hammingCode.resultFix == "object"
                                      ? hammingCode.resultFix["char"]
                                      : ""
                                  }
                                  fluid
                                  size="large"
                                />
                              </Form.Field>
                            </Form>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Segment color="black">
                  <Header>CRC Algorithm</Header>
                </Segment>
                <Segment>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={6}>
                        <Form>
                          <Form.Field>
                            <Input
                              label={
                                <Dropdown
                                  defaultValue="word"
                                  algorithm="crc"
                                  onChange={this.handleChangeOption}
                                  options={options}
                                />
                              }
                              data-name="word"
                              data-algorithm="crc"
                              value={crc.word}
                              size="large"
                              fluid
                              onChange={this.handleChangeInput}
                            />
                          </Form.Field>
                          <Form.Field>
                            <Input
                              label="G"
                              data-name="g"
                              data-algorithm="crc"
                              value={crc.g}
                              size="large"
                              fluid
                              onChange={this.handleChangeInput}
                            />
                          </Form.Field>
                          <Form.Field>
                            <Button
                              color="teal"
                              content={crc.word ? "Calculate R" : "Input a word first"}
                              icon="calculator"
                              fluid
                              onClick={this.calculateCrc}
                              disabled={!crc.word}
                            />
                          </Form.Field>
                          <Form.Field>
                            <Input
                              label="Result"
                              data-name="result"
                              data-algorithm="crc"
                              value={crc.result}
                              fluid
                              size="large"
                            />
                          </Form.Field>
                        </Form>
                      </Grid.Column>
                      <Grid.Column width={10}>
                        <Image
                          src={crcExample}
                          bordered
                          fluid
                          onClick={() => this.handleZoomImage(crcExample)}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <ImageModal img={img} imgModal={imgModal} handleCloseModal={this.handleCloseModal} />
      </>
    );
  }
}

export default BinaryAlgorithms;
