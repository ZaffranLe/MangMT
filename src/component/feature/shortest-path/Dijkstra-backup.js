import React, { Component } from "react";
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
  Table
} from "semantic-ui-react";
import { Graph } from "react-d3-graph";
import { toast } from "react-toastify";
import dijkstra from "./dijkstra-algorithm";
// const data = {
//   nodes: [{ id: "A" }],
//   links: []
// };
// const data = {
//   nodes: [
//     {
//       id: "A"
//     },
//     {
//       id: "B"
//     },
//     {
//       id: "C"
//     },
//     {
//       id: "D"
//     }
//   ],
//   links: [
//     {
//       source: "A",
//       target: "B",
//       label: 2,
//       color: "#d3d3d3", distance: 2
//     },
//     {
//       source: "B",
//       target: "A",
//       label: 2,
//       color: "#d3d3d3", distance: 2
//     },
//     {
//       source: "A",
//       target: "C",
//       label: 7,
//       color: "#d3d3d3", distance: 7
//     },
//     {
//       source: "C",
//       target: "A",
//       label: 7,
//       color: "#d3d3d3", distance: 7
//     },
//     {
//       source: "A",
//       target: "D",
//       label: 5,
//       color: "#d3d3d3", distance: 5
//     },
//     {
//       source: "D",
//       target: "A",
//       label: 5,
//       color: "#d3d3d3", distance: 5
//     },
//     {
//       source: "B",
//       target: "D",
//       label: 5,
//       color: "#d3d3d3", distance: 5
//     },
//     {
//       source: "D",
//       target: "B",
//       label: 5,
//       color: "#d3d3d3", distance: 5
//     },
//     {
//       source: "C",
//       target: "D",
//       label: 3,
//       color: "#d3d3d3", distance: 3
//     },
//     {
//       source: "D",
//       target: "C",
//       label: 3,
//       color: "#d3d3d3", distance: 3
//     },
//     {
//       source: "C",
//       target: "B",
//       label: 1,
//       color: "#d3d3d3", distance: 1
//     },
//     {
//       source: "B",
//       target: "C",
//       label: 1,
//       color: "#d3d3d3", distance: 1
//     }
//   ]
// };

const myConfig = {
  automaticRearrangeAfterDropNode: false,
  collapsible: false,
  directed: false,
  focusAnimationDuration: 0.75,
  focusZoom: 1,
  height: 400,
  highlightDegree: 1,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  maxZoom: 8,
  minZoom: 0.1,
  nodeHighlightBehavior: true,
  panAndZoom: false,
  staticGraph: false,
  width: 1500,
  node: {
    color: "#d3d3d3",
    fontColor: "black",
    fontSize: 12,
    fontWeight: "normal",
    highlightColor: "red",
    highlightFontSize: 12,
    highlightFontWeight: "bold",
    highlightStrokeColor: "SAME",
    highlightStrokeWidth: 1.5,
    labelProperty: "name",
    mouseCursor: "pointer",
    opacity: 1,
    renderLabel: true,
    size: 450,
    strokeColor: "none",
    strokeWidth: 1.5,
    svg: "",
    symbolType: "circle"
  },
  link: {
    color: "#d3d3d3",
    fontColor: "black",
    fontSize: 12,
    fontWeight: "normal",
    highlightColor: "blue",
    highlightFontSize: 8,
    highlightFontWeight: "normal",
    labelProperty: "label",
    mouseCursor: "pointer",
    opacity: 1,
    renderLabel: true,
    semanticStrokeWidth: false,
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
        color: "#d3d3d3", distance: 0
      },
      created: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { currentNode, data } = nextProps;
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
        [e.target.name]: [e.target.value]
      }
    });
  };

  handleCreateLink = () => {
    const { currentLink, currentNode } = this.state;
    const { data } = this.props;
    const links = data.links;
    let link1 = currentLink;
    if (currentLink.label !== 0 && currentLink.target !== "") {
      link1.source = currentNode;
      link1.label = link1.label[0];
      link1.target = link1.target[0];
      link1.distance = link1.label;
      links.push(link1);
      let link2 = {};
      link2.source = link1.target;
      link2.target = currentNode;
      link2.distance = link1.distance;
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
    const { data } = this.props;
    if (Boolean(link)) {
      let linksFiltered = data.links.filter(value => {
        if (
          (value.source === link.source && value.target === link.target) ||
          (value.source === link.target && value.target === link.source)
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
                value={currentNodeLinks[i].label}
                type="number"
              />
              <Button
                onClick={() => this.handleRemoveLink(currentNodeLinks[i])}
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
                name="label"
                label="Distance"
                type="number"
                value={currentLink.label}
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

class Dijkstra extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numOfNode: 1,
      currentNode: "",
      nodeModal: false,
      dijkstraResult: [],
      bellmanFordResult: [],
      activeIndex: 0,
      data: {
        nodes: [
          {
            id: "A"
          },
          {
            id: "B"
          },
          {
            id: "C"
          },
          {
            id: "D"
          }
        ],
        links: [
          {
            source: "A",
            target: "B",
            label: 2,
            color: "#d3d3d3",
            distance: 2
          },
          {
            source: "B",
            target: "A",
            label: 2,
            color: "#d3d3d3",
            distance: 2
          },
          {
            source: "A",
            target: "C",
            label: 7,
            color: "#d3d3d3",
            distance: 7
          },
          {
            source: "C",
            target: "A",
            label: 7,
            color: "#d3d3d3",
            distance: 7
          },
          {
            source: "A",
            target: "D",
            label: 5,
            color: "#d3d3d3",
            distance: 5
          },
          {
            source: "D",
            target: "A",
            label: 5,
            color: "#d3d3d3",
            distance: 5
          },
          {
            source: "B",
            target: "D",
            label: 5,
            color: "#d3d3d3",
            distance: 5
          },
          {
            source: "D",
            target: "B",
            label: 5,
            color: "#d3d3d3",
            distance: 5
          },
          {
            source: "C",
            target: "D",
            label: 3,
            color: "#d3d3d3",
            distance: 3
          },
          {
            source: "D",
            target: "C",
            label: 3,
            color: "#d3d3d3",
            distance: 3
          },
          {
            source: "C",
            target: "B",
            label: 1,
            color: "#d3d3d3",
            distance: 1
          },
          {
            source: "B",
            target: "C",
            label: 1,
            color: "#d3d3d3",
            distance: 1
          }
        ]
      }
    };
  }

  componentDidMount() {
    this.setState({
      numOfNode: this.state.data.nodes.length
    });
  }

  handleChange = e => {
    let numOfNode = e.target.value;
    let nodes = [];
    for (let i = 0; i < numOfNode; i++) {
      let node = {
        id: String.fromCharCode(65 + i)
      };
      nodes.push(node);
    }
    this.setState({
      numOfNode,
      data: [...this.state.data, nodes]
    });
  };

  handleOpenModal = currentNode => {
    const currentNodeLink = [];
    const { data } = this.state;
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
    const { data } = this.state;
    for (let link of data.links) {
      link["color"] = "#d3d3d3"
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

  getDijkstraResult = data => {
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
                      <Table.HeaderCell key={index}>{cell}</Table.HeaderCell>
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
                            ({cell.value},{cell.lastNode}){" "}
                            {cell.marked && (
                              <Icon color="green" name="checkmark" />
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
                            onClick={() => this.handleChangePathColor(way)}
                          >
                            {way}
                          </Button>
                        ) : (
                          "Shortest way"
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

  handleChooseAccordion = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const {
      currentNode,
      currentNodeLink,
      nodeModal,
      activeIndex,
      dijkstraResult,
      data
    } = this.state;
    return (
      <>
        <Segment>
          <Header>Dijkstra</Header>
          <NodeModal
            currentNode={currentNode}
            currentNodeLink={currentNodeLink}
            nodeModal={nodeModal}
            handleCloseModal={this.handleCloseModal}
            data={data}
          />
        </Segment>
        <Segment>
          <Graph
            id="node-graph"
            data={data}
            config={myConfig}
            onClickNode={this.handleOpenModal}
          />
        </Segment>
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
              <Grid.Column width={10}>
                {data.nodes.map((node, index) => {
                  return (
                    <Button
                      key={index}
                      color="teal"
                      onClick={() => this.handleOpenModal(node.id)}
                    >
                      {node.id}
                    </Button>
                  );
                })}
              </Grid.Column>
              <Grid.Column width={3}>
                <Button
                  positive
                  onClick={() => this.getDijkstraResult(data)}
                  content="Dijkstra"
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Accordion>
                  <Accordion.Title
                    active={activeIndex === 1}
                    index={1}
                    onClick={this.handleChooseAccordion}
                  >
                    <Header>
                      Dijkstra Algorithm <Icon name="dropdown" />
                    </Header>
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 1}>
                    <Tab panes={dijkstraResult} />
                  </Accordion.Content>

                  <Accordion.Title
                    active={activeIndex === 2}
                    index={2}
                    onClick={this.handleChooseAccordion}
                  >
                    <Header>
                      Bellman-Ford Algorithm
                      <Icon name="dropdown" />
                    </Header>
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 1}>
                    Yo
                  </Accordion.Content>
                </Accordion>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </>
    );
  }
}

export default Dijkstra;
