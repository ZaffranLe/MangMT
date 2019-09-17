const _ = require("lodash");

export default function dijkstra(data) {
  const nodes = [];
  const results = [];
  for (let node of data.nodes) {
    let obj = {};
    obj.node = node.id;
    obj.way = node.id;
    obj.currentValue = 0;
    obj.values = [];
    obj.links = data.links.filter(link => {
      return link.source === node.id;
    });
    obj.marked = false;
    nodes.push(obj);
  }

  for (let node of nodes) {
    let otherNodes = _.cloneDeep(
      nodes.filter(other => {
        return other !== node;
      })
    );
    let min = 0;
    let markedNodes = [];
    let currentNode = _.cloneDeep(node);
    markedNodes.push(node);
    while (markedNodes.length < nodes.length) {
      for (let other of otherNodes) {
        for (let link of currentNode.links) {
          if (link.target === other.node) {
            if (other.currentValue !== 0) {
              if (
                other.currentValue >
                currentNode.currentValue + parseInt(link.distance, 10)
              ) {
                other.way = currentNode.way + other.node;
                other.currentValue =
                  currentNode.currentValue + parseInt(link.distance, 10);
              }
            } else {
              other.way = currentNode.way + other.way;
              other.currentValue = currentNode.currentValue + parseInt(link.distance, 10);
            }
          }
        }
        if ((min > other.currentValue || min === 0) && other.currentValue > 0) {
          min = other.currentValue;
        }
        let obj = {};
        obj["value"] = other.currentValue;
        obj["lastNode"] = other.way.slice(
          other.way.length - 2,
          other.way.length - 1
        );
        other.values.push(obj);
      }
      for (let other of otherNodes) {
        if (other.currentValue === min) {
          other.marked = true;
          currentNode = _.cloneDeep(other);
          // console.log(currentNode);
          markedNodes.push(other);
          otherNodes = otherNodes.filter(node => {
            return node !== other;
          });
          // console.log(otherNodes);
          min = 0;
          break;
        }
      }
    }
    results.push(markedNodes);
  }
  console.log(results);
  const dijkstraTables = [];
  results.map(result => {
    let dijkstraTable = {};
    dijkstraTable.headerCells = [];
    dijkstraTable.bodyRows = [];
    dijkstraTable.footerCells = [];
    result.map(node => {
      dijkstraTable.headerCells.push(node["node"]);
      dijkstraTable.footerCells.push(node["way"]);
    });
    for (let i = 0; i < result.length; i++) {
      let cells = [];
      result.map(node => {
        let cell = {};
        cell.marked = false;
        if (Boolean(node["values"][i])) {
          cell.value = node["values"][i]["value"];
          cell.lastNode = node["values"][i]["lastNode"];
          if (i === node["values"].length - 1) {
            cell.marked = true;
          }
        } else {
          cell.value = "-";
          cell.lastNode = "-";
        }
        cells.push(cell);
      });
      dijkstraTable.bodyRows.push(cells);
    }
    dijkstraTables.push(dijkstraTable);
  });
  return dijkstraTables;
}
