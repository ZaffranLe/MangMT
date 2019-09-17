const _ = require("lodash");

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
//     },
//     {
//       id: "E"
//     },
//     {
//       id: "F"
//     }
//   ],
//   links: [
//     {
//       source: "A",
//       target: "B",
//       label: 2,
//       distance: 2
//     },
//     {
//       source: "B",
//       target: "A",
//       label: 2,
//       distance: 2
//     },
//     {
//       source: "A",
//       target: "C",
//       label: 1,
//       distance: 1
//     },
//     {
//       source: "C",
//       target: "A",
//       label: 1,
//       distance: 1
//     },
//     {
//       source: "C",
//       target: "E",
//       label: 2,
//       distance: 2
//     },
//     {
//       source: "E",
//       target: "C",
//       label: 2,
//       distance: 2
//     },
//     {
//       source: "E",
//       target: "B",
//       label: 5,
//       distance: 5
//     },
//     {
//       source: "B",
//       target: "E",
//       label: 5,
//       distance: 5
//     },
//     {
//       source: "E",
//       target: "D",
//       label: 3,
//       distance: 3
//     },
//     {
//       source: "D",
//       target: "E",
//       label: 3,
//       distance: 3
//     },
//     {
//       source: "D",
//       target: "B",
//       label: 4,
//       distance: 4
//     },
//     {
//       source: "B",
//       target: "D",
//       label: 4,
//       distance: 4
//     },
//     {
//       source: "F",
//       target: "D",
//       label: 2,
//       distance: 2
//     },
//     {
//       source: "D",
//       target: "F",
//       label: 2,
//       distance: 2
//     }
//   ]
// };

export default function bellmanFord(data) {
  const bellmanFordResult = [];
  const originalNodes = [];
  for (let node of data.nodes) {
    let obj = {};
    obj.node = node.id;
    obj.way = node.id;
    obj.currentValue = 0;
    obj.links = data.links.filter(link => {
      return link.source === node.id;
    });
    obj.marked = false;
    originalNodes.push(obj);
  }
  for (let originalNode of originalNodes) {
    const results = [];

    let startNode = _.cloneDeep(originalNode);
    let firstNodes = [];
    let originalNodesClone = _.cloneDeep(originalNodes);
    for (let link of startNode.links) {
      for (let otherNode of originalNodesClone) {
        if (link.target === otherNode.node) {
          otherNode.currentValue = parseInt(link.distance, 10);
          firstNodes.push(otherNode);
        }
      }
    }

    for (let firstNode of firstNodes) {
      let currentNodes = [firstNode];
      let nodes = _.cloneDeep(originalNodesClone);
      for (let node of nodes) {
        if (node !== firstNode) {
          node.currentValue = 0;
        }
      }

      while (currentNodes.length > 0) {
        for (let currentNode of currentNodes) {
          currentNode.marked = false;
          for (let link of currentNode.links) {
            for (let otherNode of nodes) {
              if (link.target === otherNode.node) {
                if (link.target !== firstNode.node) {
                  if (
                    otherNode.currentValue === 0 ||
                    otherNode.currentValue >
                      currentNode.currentValue + parseInt(link.distance, 10)
                  ) {
                    otherNode.currentValue =
                      currentNode.currentValue + parseInt(link.distance, 10);
                    otherNode.marked = true;
                    otherNode.way = currentNode.way + otherNode.node;
                  }
                } else {
                  otherNode.currentValue = firstNode.currentValue;
                }
              }
            }
          }
        }
        currentNodes = currentNodes.filter(node => {
          return node.marked;
        });
        for (let node of nodes) {
          if (currentNodes.indexOf(node) === -1 && node.marked) {
            currentNodes.push(node);
          }
        }
      }
      nodes = nodes.filter(node => {
        return node.node !== startNode.node;
      });
      results.push(nodes);
    }

    let nodeList = _.cloneDeep(data.nodes);
    for (let node of nodeList) {
      node["values"] = [];
      for (let result of results) {
        for (let resultNode of result) {
          if (resultNode.node === node.id) {
            node["values"].push(resultNode);
          }
        }
      }
      node["values"].sort((node1, node2) => {
        return node1.way > node2.way;
      });
      if (node["values"].length > 0) {
        let minValue = node["values"][0]["currentValue"];
        for (let nodeValue of node["values"]) {
          if (minValue > nodeValue["currentValue"]) {
            minValue = nodeValue["currentValue"];
          }
        }
        for (let nodeValue of node["values"]) {
          if (minValue === nodeValue["currentValue"]) {
            nodeValue["marked"] = true;
            nodeValue["way"] = startNode.node + nodeValue["way"];
          }
        }
      }
    }
    firstNodes.sort((node1, node2) => {
      return node1.way > node2.way;
    });
    let singleResult = {};
    singleResult["firstNodes"] = _.cloneDeep(firstNodes);
    singleResult["startNode"] = _.cloneDeep(startNode);
    singleResult["nodeList"] = nodeList.filter(node => {
      return node["values"].length > 0;
    });
    bellmanFordResult.push(singleResult);
  }
  return bellmanFordResult;
}
