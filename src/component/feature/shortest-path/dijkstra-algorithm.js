const _ = require("lodash");

export default function dijkstra(data) {
    const nodes = [];
    const results = [];
    for (let node of data.nodes) {
        let obj = {};
        obj.node = node.id;
        obj.way = node.id;
        obj.currentValue = Infinity;
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
        let min = Infinity;
        let markedNodes = [];
        let currentNode = _.cloneDeep(node);
        currentNode.currentValue = 0;
        markedNodes.push(node);
        while (markedNodes.length < nodes.length) {
            for (let other of otherNodes) { 
                for (let link of currentNode.links) {
                    if (link.target === other.node) {
                        if (
                            other.currentValue >
                            currentNode.currentValue +
                                parseInt(link.distance, 10)
                        ) {
                            other.way = currentNode.way + other.node;
                            other.currentValue =
                                currentNode.currentValue +
                                parseInt(link.distance, 10);
                        }
                    }
                }
                if (min > other.currentValue) {
                    min = other.currentValue;
                }
                let obj = {};
                obj["value"] = other.currentValue;
                obj["lastNode"] = other.way.slice(
                    other.way.length - 2,
                    other.way.length - 1
                );
                other.values.push(obj);
                console.log(other.node);
            }
            for (let other of otherNodes) {
                if (other.currentValue === min) {
                    other.marked = true;
                    currentNode = _.cloneDeep(other);
                    markedNodes.push(other);
                    otherNodes = otherNodes.filter(node => {
                        return node !== other;
                    });
                    min = Infinity;
                    break;
                }
            }
        }
        results.push(markedNodes);
    }
    const dijkstraTables = [];
    results.map(result => {
        let dijkstraTable = {};
        dijkstraTable.headerCells = [];
        dijkstraTable.bodyRows = [];
        dijkstraTable.footerCells = [];
        result.map(node => {
            dijkstraTable.headerCells.push(node["node"]);
            dijkstraTable.footerCells.push(node["way"]);
            return true;
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
                return cells.push(cell);
            });
            dijkstraTable.bodyRows.push(cells);
        }
        return dijkstraTables.push(dijkstraTable);
    });
    return dijkstraTables;
}
