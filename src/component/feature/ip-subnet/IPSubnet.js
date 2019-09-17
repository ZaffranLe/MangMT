import React, { Component, Fragment } from "react";
import {
    Header,
    Grid,
    Segment,
    Input,
    Form,
    Dropdown,
    Button,
    Table,
    Message
} from "semantic-ui-react";
import subnets from "./subnet-data";
import ipSubnet from "./ip-subnet-algorithm";
const subnetOptions = subnets.map((subnet, idx) => {
    let obj = {};
    obj["ip"] = subnet["ip"];
    obj["cidr"] = subnet["cidr"];
    obj["type"] = subnet["type"];
    obj["text"] = subnet["ip"] + " " + subnet["cidr"];
    obj["key"] = idx;
    obj["value"] = subnet;
    return obj;
});

class IPSubnet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ip: "",
            subnet: "",
            result: ""
        };
    }

    handleChangeIp = e => {
        this.setState({
            ip: e.target.value
        });
    };

    handleChangeSubnet = (e, data) => {
        this.setState({
            subnet: data.value
        });
    };

    handleCalculate = () => {
        const { ip, subnet } = this.state;
        const result = ipSubnet(ip, subnet);
        this.setState({
            result
        });
    };

    render() {
        const { ip, result } = this.state;
        return (
            <Fragment>
                <Segment>
                    <Header>IPv4 Subnet Calculator</Header>
                </Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Segment>
                                <Form>
                                    <Form.Field>
                                        <label>IP Address</label>
                                        <Input
                                            value={ip}
                                            onChange={this.handleChangeIp}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Subnet</label>
                                        <Dropdown
                                            placeholder="Choose one subnet"
                                            selection
                                            fluid
                                            onChange={this.handleChangeSubnet}
                                            options={subnetOptions}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Button
                                            color="teal"
                                            content="Calculate"
                                            icon="play"
                                            fluid
                                            onClick={this.handleCalculate}
                                        />
                                    </Form.Field>
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Segment>
                                {result === "" ? (
                                    <Message warning>
                                        <Message.Header>
                                            Nothing to display
                                        </Message.Header>
                                    </Message>
                                ) : (
                                    <Table>
                                        <Table.Body>
                                            {Object.keys(result).map(
                                                item => {
                                                    return (
                                                        <Table.Row key={item}>
                                                            <Table.Cell>
                                                                {result[item]["name"]}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {result[item]["value"]}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                }
                                            )}
                                        </Table.Body>
                                    </Table>
                                )}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Fragment>
        );
    }
}

export default IPSubnet;
