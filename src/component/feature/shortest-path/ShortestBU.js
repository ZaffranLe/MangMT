import React, { Component, Fragment } from "react";
import {
    Segment,
    Header,
    Grid,
    Input,
    Modal,
    Button,
    Tab,
    Accordion,
    Icon,
    Table,
    TextArea,
    Form,
    Popup
} from "semantic-ui-react";
import { Graph } from "react-d3-graph";
import { toast } from "react-toastify";
import dijkstra from "./dijkstra-algorithm";
import bellmanFord from "./bellman-ford-algorithm";
const data = {
    nodes: [
        {
            id: "A"
        }
    ],
    links: []
};

const myConfig = {
    height: 400,
    highlightDegree: 1,
    highlightOpacity: 0.2,
    linkHighlightBehavior: true,
    nodeHighlightBehavior: true,
    width: 775,
    node: {
        color: "#fff",
        fontColor: "black",
        fontSize: 20,
        fontWeight: "normal",
        highlightColor: "red",
        highlightFontSize: 20,
        highlightFontWeight: "bold",
        highlightStrokeColor: "SAME",
        highlightStrokeWidth: 1.5,
        labelProperty: "name",
        mouseCursor: "pointer",
        opacity: 1,
        renderLabel: true,
        size: 450,
        strokeColor: "#000",
        strokeWidth: 1.5,
        svg: "",
        symbolType: "circle"
    },
    link: {
        color: "#d3d3d3",
        fontColor: "black",
        fontSize: 20,
        fontWeight: "normal",
        highlightColor: "blue",
        highlightFontSize: 20,
        highlightFontWeight: "normal",
        labelProperty: "label",
        mouseCursor: "pointer",
        opacity: 1,
        renderLabel: true,
        strokeWidth: 4
    },
    d3: {
        gravity: -500
    }
};

class NodeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentNode: "",
            numOfLink: 0,
            currentNodeLinks: [],
            currentLink: {
                source: "",
                target: "",
                label: 0,
                color: "#d3d3d3",
                distance: 0
            },
            created: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const { currentNode } = nextProps;
        const currentNodeLinks = [];
        for (let link of data.links) {
            if (link.source === currentNode) {
                currentNodeLinks.push(link);
            }
        }
        this.setState({
            currentNode,
            currentNodeLinks,
            numOfLink: currentNodeLinks.length
        });
    }

    handleAddLinkForm = () => {
        this.setState({
            numOfLink: this.state.numOfLink + 1
        });
    };

    handleChange = e => {
        this.setState({
            currentLink: {
                ...this.state.currentLink,
                [e.target.name]: e.target.value
            }
        });
    };

    handleCreateLink = () => {
        const { currentLink, currentNode } = this.state;
        const links = data.links;
        let link1 = currentLink;
        if (currentLink.distance !== 0 && currentLink.target !== "") {
            link1.source = currentNode;
            links.push(link1);
            let link2 = {};
            link2.source = link1.target;
            link2.target = currentNode;
            link2.distance = link1.distance;
            link2.label = link1.distance;
            links.push(link2);
            toast.success("Create link succeed!");
            const currentNodeLinks = [];
            for (let link of data.links) {
                if (link.source === currentNode) {
                    currentNodeLinks.push(link);
                }
            }
            this.setState({
                currentNodeLinks,
                numOfLink: currentNodeLinks.length
            });
        } else {
            toast.error("Create link failed!");
        }
    };

    handleRemoveLink = (link = null) => {
        if (Boolean(link)) {
            let linksFiltered = data.links.filter(value => {
                if (
                    (value.source === link.source &&
                        value.target === link.target) ||
                    (value.source === link.target &&
                        value.target === link.source)
                ) {
                    return false;
                }
                return true;
            });
            data.links = linksFiltered;
        }
        this.setState({
            numOfLink: this.state.numOfLink - 1
        });
    };

    render() {
        const {
            numOfLink,
            currentNodeLinks,
            currentNode,
            currentLink
        } = this.state;
        const { nodeModal, handleCloseModal } = this.props;
        const rows = [];
        for (let i = 0; i < numOfLink; i++) {
            if (i < currentNodeLinks.length) {
                rows.push(
                    <Grid.Row key={i}>
                        <Grid.Column width={6}>
                            <Input
                                label="Target"
                                value={currentNodeLinks[i].target}
                                type="text"
                            />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Input
                                label="Distance"
                                value={currentNodeLinks[i].distance}
                                type="number"
                            />
                            <Button
                                onClick={() =>
                                    this.handleRemoveLink(currentNodeLinks[i])
                                }
                                negative
                                icon="trash"
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            } else {
                rows.push(
                    <Grid.Row key={i}>
                        <Grid.Column width={6}>
                            <Input
                                onChange={this.handleChange}
                                name="target"
                                label="Target"
                                type="text"
                                value={currentLink.target}
                            />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Input
                                onChange={this.handleChange}
                                name="distance"
                                label="Distance"
                                type="number"
                                value={currentLink.distance}
                            />
                            <Button
                                onClick={this.handleCreateLink}
                                positive
                                icon="checkmark"
                            />
                            <Button
                                onClick={() => this.handleRemoveLink()}
                                negative
                                icon="trash"
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            }
        }
        return (
            <Modal open={nodeModal} onClose={handleCloseModal}>
                <Modal.Header>Node {currentNode} config</Modal.Header>
                <Modal.Content>
                    <Segment>
                        <Button
                            positive
                            onClick={this.handleAddLinkForm}
                            content="Add link"
                            icon="plus"
                        />
                    </Segment>
                    <Grid>
                        {rows.map((row, indexx) => {
                            return row;
                        })}
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCloseModal}>Close</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

class ShortestPath extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfNode: 1,
            currentNode: "",
            nodeModal: false,
            dijkstraResult: [],
            bellmanFordResult: [],
            activeIndex: 0,
            textArea: ""
        };
    }

    componentDidMount() {
        this.setState({
            numOfNode: data.nodes.length
        });
    }

    handleChange = e => {
        let numOfNode = e.target.value;
        this.setState({
            numOfNode
        });
        if (e.target.value != 0 && e.target.value <= 10) {
            let nodes = [];
            for (let i = 0; i < numOfNode; i++) {
                let node = {
                    id: String.fromCharCode(65 + i)
                };
                nodes.push(node);
            }

            data.nodes = nodes;
        }
    };

    handleOpenModal = currentNode => {
        const currentNodeLink = [];
        for (let link of data.links) {
            if (link.source === currentNode) {
                currentNodeLink.push(link);
            }
        }
        this.setState({
            currentNode,
            nodeModal: true
        });
    };

    handleCloseModal = () => {
        this.setState({
            nodeModal: false
        });
    };

    handleChangePathColor = way => {
        const nodes = way.split("");
        for (let link of data.links) {
            link["color"] = "#d3d3d3";
        }
        for (let i = 0; i < nodes.length - 1; i++) {
            let source = nodes[i];
            let target = nodes[i + 1];
            console.log(source, target);
            for (let link of data.links) {
                if (
                    (link.source === source && link.target === target) ||
                    (link.source === target && link.target === source)
                ) {
                    link["color"] = "red";
                }
            }
        }
        console.log(data.links);
        this.forceUpdate();
    };

    getDijkstraResult = () => {
        const dijkstraTables = dijkstra(data);
        const panes = [];
        for (let table of dijkstraTables) {
            panes.push({
                menuItem: table.headerCells[0],
                render: () => (
                    <Tab.Pane>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    {table.headerCells.map((cell, index) => {
                                        return (
                                            <Table.HeaderCell key={index}>
                                                {cell}
                                            </Table.HeaderCell>
                                        );
                                    })}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {table.bodyRows.map((row, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            {row.map((cell, cellIndex) => {
                                                return (
                                                    <Table.Cell key={cellIndex}>
                                                        {isFinite(
                                                            cell.value
                                                        ) ? (
                                                            <>
                                                                ({cell.value},
                                                                {cell.lastNode}){" "}
                                                                {cell.marked && (
                                                                    <Icon
                                                                        color="green"
                                                                        name="checkmark"
                                                                    />
                                                                )}
                                                            </>
                                                        ) : (
                                                            "∞"
                                                        )}
                                                    </Table.Cell>
                                                );
                                            })}
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                            <Table.Footer>
                                <Table.Row>
                                    {table.footerCells.map((way, index) => {
                                        return (
                                            <Table.HeaderCell key={index}>
                                                {way.length > 1 ? (
                                                    <Button
                                                        positive
                                                        onClick={() =>
                                                            this.handleChangePathColor(
                                                                way
                                                            )
                                                        }
                                                    >
                                                        {way}
                                                    </Button>
                                                ) : (
                                                    "X"
                                                )}
                                            </Table.HeaderCell>
                                        );
                                    })}
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Tab.Pane>
                )
            });
        }
        this.setState({
            dijkstraResult: panes
        });
    };

    getBellmanFordResult = () => {
        const bellmanFordResults = bellmanFord(data);
        const panes = [];
        for (let result of bellmanFordResults) {
            panes.push({
                menuItem: result.startNode.node,
                render: () => (
                    <Tab.Pane>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        Start: {result.startNode.node}
                                    </Table.HeaderCell>
                                    {result.firstNodes.map((node, index) => {
                                        return (
                                            <Table.HeaderCell key={index}>
                                                {node.node}
                                            </Table.HeaderCell>
                                        );
                                    })}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {result.nodeList.map((node, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{node.id}</Table.Cell>
                                            {node.values.map((value, idx) => {
                                                return (
                                                    <Table.Cell key={idx}>
                                                        {value.currentValue}{" "}
                                                        {value.marked && (
                                                            <Fragment>
                                                                <Icon
                                                                    color="green"
                                                                    name="checkmark"
                                                                />{" "}
                                                                -
                                                                <Button
                                                                    positive
                                                                    onClick={() =>
                                                                        this.handleChangePathColor(
                                                                            value.way
                                                                        )
                                                                    }
                                                                >
                                                                    {value.way}
                                                                </Button>
                                                            </Fragment>
                                                        )}
                                                    </Table.Cell>
                                                );
                                            })}
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </Tab.Pane>
                )
            });
        }
        this.setState({
            bellmanFordResult: panes
        });
    };

    handleChooseAccordion = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    };

    handleCalculate = () => {
        this.getBellmanFordResult();
        this.getDijkstraResult();
    };

    handleChangeTextArea = (e, dataTA) => {
        console.log(dataTA.value);
        // eslint-disable-next-line
        if (dataTA.value == "") {
            data.links = [];
        } else if (dataTA.value[dataTA.value.length - 1] === "\n") {
            console.log(dataTA.value);
            let textArea = dataTA.value
                .slice(0, dataTA.value.length - 1)
                .split("\n");
            console.log(textArea);
            data.links = [];
            for (let linkText of textArea) {
                linkText = linkText.split(" ");
                let link1 = {};
                link1["source"] = linkText[0];
                link1["target"] = linkText[1];
                link1["distance"] = linkText[2];
                let link2 = {};
                link2["label"] = linkText[2];
                link2["source"] = linkText[1];
                link2["target"] = linkText[0];
                link2["distance"] = linkText[2];
                data.links.push(link1);
                data.links.push(link2);
            }
            console.log(data.links);
        }
        this.forceUpdate();
    };

    render() {
        const {
            currentNode,
            currentNodeLink,
            nodeModal,
            activeIndex,
            dijkstraResult,
            bellmanFordResult
        } = this.state;
        return (
            <>
                <Segment>
                    <Header>Shortest Path</Header>
                    <NodeModal
                        currentNode={currentNode}
                        currentNodeLink={currentNodeLink}
                        nodeModal={nodeModal}
                        handleCloseModal={this.handleCloseModal}
                    />
                </Segment>
                <Segment>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Segment>
                                    <Graph
                                        id="node-graph"
                                        data={data}
                                        config={myConfig}
                                        onClickNode={this.handleOpenModal}
                                    />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Segment>
                                            <Accordion>
                                                <Accordion.Title
                                                    active={activeIndex === 1}
                                                    index={1}
                                                    onClick={
                                                        this
                                                            .handleChooseAccordion
                                                    }
                                                >
                                                    <Header>
                                                        Dijkstra Algorithm{" "}
                                                        <Icon name="dropdown" />
                                                    </Header>
                                                </Accordion.Title>
                                                <Accordion.Content
                                                    active={activeIndex === 1}
                                                >
                                                    <Tab
                                                        panes={dijkstraResult}
                                                    />
                                                </Accordion.Content>

                                                <Accordion.Title
                                                    active={activeIndex === 2}
                                                    index={2}
                                                    onClick={
                                                        this
                                                            .handleChooseAccordion
                                                    }
                                                >
                                                    <Header>
                                                        Bellman-Ford Algorithm
                                                        <Icon name="dropdown" />
                                                    </Header>
                                                </Accordion.Title>
                                                <Accordion.Content
                                                    active={activeIndex === 2}
                                                >
                                                    <Tab
                                                        panes={
                                                            bellmanFordResult
                                                        }
                                                    />
                                                </Accordion.Content>
                                            </Accordion>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Segment>
                        <Header>Configuration</Header>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <Input
                                        name="numOfNode"
                                        min={1}
                                        max={10}
                                        type="number"
                                        value={this.state.numOfNode}
                                        onChange={this.handleChange}
                                        label="Number of node"
                                    />
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {data.nodes.map((node, index) => {
                                        return (
                                            <Button
                                                key={index}
                                                color="teal"
                                                onClick={() =>
                                                    this.handleOpenModal(
                                                        node.id
                                                    )
                                                }
                                            >
                                                {node.id}
                                            </Button>
                                        );
                                    })}
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Button
                                        positive
                                        onClick={this.handleCalculate}
                                        content="Find shortest path"
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Form>
                                        <Popup
                                            trigger={
                                                <TextArea
                                                    onChange={
                                                        this
                                                            .handleChangeTextArea
                                                    }
                                                />
                                            }
                                            on="focus"
                                            content="Example: 'A B 2' => Link from A to B with weight = 2"
                                            header="Create link between Nodes"
                                        />
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Segment>
            </>
        );
    }
}

export default ShortestPath;
