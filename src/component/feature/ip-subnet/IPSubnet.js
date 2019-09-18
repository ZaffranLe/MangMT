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
    obj["text"] = subnet["ip"] + " /" + subnet["cidr"];
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
                                    <>
                                        <Header>Result</Header>
                                        <Table>
                                            <Table.Body>
                                                {Object.keys(
                                                    result["data"]
                                                ).map(item => {
                                                    return (
                                                        <Table.Row key={item}>
                                                            <Table.Cell>
                                                                {
                                                                    result[
                                                                        "data"
                                                                    ][item][
                                                                        "name"
                                                                    ]
                                                                }
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {
                                                                    result[
                                                                        "data"
                                                                    ][item][
                                                                        "value"
                                                                    ]
                                                                }
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                })}
                                            </Table.Body>
                                        </Table>
                                        {result["networks"]["networks"].length >
                                            0 && (
                                            <>
                                                <Header>
                                                    All{" "}
                                                    {
                                                        result["networks"][
                                                            "networks"
                                                        ].length
                                                    }{" "}
                                                    of the Possible{" "}
                                                    {result["networks"]["cidr"]}{" "}
                                                    Networks for{" "}
                                                    {result["networks"]["ip"]}
                                                </Header>
                                                <Table>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.HeaderCell>
                                                                Network Address
                                                            </Table.HeaderCell>
                                                            <Table.HeaderCell>
                                                                Usable Host
                                                                Range
                                                            </Table.HeaderCell>
                                                            <Table.HeaderCell>
                                                                Broadcast
                                                                Address
                                                            </Table.HeaderCell>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {result["networks"][
                                                            "networks"
                                                        ].map(
                                                            (network, idx) => {
                                                                return (
                                                                    <Table.Row
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        <Table.Cell>
                                                                            {
                                                                                network[
                                                                                    "addr"
                                                                                ]
                                                                            }
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {
                                                                                network[
                                                                                    "range"
                                                                                ]
                                                                            }
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {
                                                                                network[
                                                                                    "broadcast"
                                                                                ]
                                                                            }
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                );
                                                            }
                                                        )}
                                                    </Table.Body>
                                                </Table>
                                            </>
                                        )}
                                    </>
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
