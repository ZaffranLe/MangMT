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
  Divider
} from "semantic-ui-react";
import udpChecksum from "./udp-checksum-algorithm";
import { hammingCode, fixHammingCode } from "./hamming-algorithm";
import crcCalculate from "./crc-algorithm";
const udpChecksumExample = require("./udp-checksum-example.png");
const hammingCodeExample = require("./hamming-code-example.jpg");
const crcExample = require("./crc-example.png");
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
        result: ""
      },
      hammingCode: {
        char: "",
        result: "",
        hammingCode: "",
        resultFix: ""
      },
      crc: {
        word: "",
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

  calculateHammingCode = () => {
    const result = hammingCode(this.state.hammingCode.char);
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
    const result = crcCalculate(crc.word, crc.g);
    this.setState({
      crc: {
        ...crc,
        result
      }
    });
  };

  render() {
    const { img, imgModal, udpChecksum, hammingCode, crc } = this.state;
    return (
      <>
        <Segment>
          <Header>BinaryAlgorithms</Header>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Segment>
                      <Header>UDP Checksum 16-bit</Header>
                    </Segment>
                    <Segment>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={6}>
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
                                  value={udpChecksum.result}
                                  fluid
                                  size="large"
                                />
                              </Form.Field>
                            </Form>
                          </Grid.Column>
                          <Grid.Column width={10}>
                            <Image
                              src={udpChecksumExample}
                              bordered
                              fluid
                              onClick={() =>
                                this.handleZoomImage(udpChecksumExample)
                              }
                            />
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
                    <Segment>
                      <Header>Hamming Code of a 8-bit character</Header>
                    </Segment>
                    <Segment>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={6}>
                            <Form>
                              <Form.Field>
                                <Input
                                  label="Char"
                                  data-name="char"
                                  data-algorithm="hammingCode"
                                  value={hammingCode.char}
                                  size="large"
                                  fluid
                                  onChange={this.handleChangeInput}
                                />
                              </Form.Field>
                              <Form.Field>
                                <Button
                                  color="teal"
                                  content={
                                    hammingCode.char
                                      ? "Calculate Hamming code of " +
                                        hammingCode.char
                                      : "Input a character first"
                                  }
                                  icon="calculator"
                                  fluid
                                  onClick={this.calculateHammingCode}
                                  disabled={!hammingCode.char}
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
                              onClick={() =>
                                this.handleZoomImage(hammingCodeExample)
                              }
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
                <Segment>
                  <Header>CRC Algorithm</Header>
                </Segment>
                <Segment>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={6}>
                        <Form>
                          <Form.Field>
                            <Input
                              label="Word"
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
                              content={
                                crc.word ? "Calculate R" : "Input a word first"
                              }
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
        <ImageModal
          img={img}
          imgModal={imgModal}
          handleCloseModal={this.handleCloseModal}
        />
      </>
    );
  }
}

export default BinaryAlgorithms;
