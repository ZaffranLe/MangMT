const _ = require("lodash");

const data = {
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
    },
    {
      id: "E"
    },
    {
      id: "F"
    }
  ],
  links: [
    {
      source: "A",
      target: "B",
      label: 2,
      distance: 2
    },
    {
      source: "B",
      target: "A",
      label: 2,
      distance: 2
    },
    {
      source: "A",
      target: "C",
      label: 1,
      distance: 1
    },
    {
      source: "C",
      target: "A",
      label: 1,
      distance: 1
    },
    {
      source: "C",
      target: "E",
      label: 2,
      distance: 2
    },
    {
      source: "E",
      target: "C",
      label: 2,
      distance: 2
    },
    {
      source: "E",
      target: "B",
      label: 5,
      distance: 5
    },
    {
      source: "B",
      target: "E",
      label: 5,
      distance: 5
    },
    {
      source: "E",
      target: "D",
      label: 3,
      distance: 3
    },
    {
      source: "D",
      target: "E",
      label: 3,
      distance: 3
    },
    {
      source: "D",
      target: "B",
      label: 4,
      distance: 4
    },
    {
      source: "B",
      target: "D",
      label: 4,
      distance: 4
    },
    {
      source: "F",
      target: "D",
      label: 2,
      distance: 2
    },
    {
      source: "D",
      target: "F",
      label: 2,
      distance: 2
    }
  ]
};

const nodes = [];
for (let node of data.nodes) {
  let obj = {};
  obj.node = node.id;
  obj.way = node.id;
  obj.currentValue = 0;
  obj.links = data.links.filter(link => {
    return link.source === node.id;
  });
  obj.marked = false;
  nodes.push(obj);
}

let currentNodes = [nodes[0]];
while (currentNodes.length > 0) {
  for (let currentNode of currentNodes) {
    currentNode.marked = false;
    for (let link of currentNode.links) {
      for (let otherNode of nodes) {
        if (link.target === otherNode.node) {
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
console.log(nodes);
