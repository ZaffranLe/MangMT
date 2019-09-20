const _ = require("lodash");

export default function dijkstra(data) {
    const nodes = [];
    const results = [];
    for (let node of data.nodes) { // Cau truc du lieu cua 1 dinh
        let obj = {};
        obj.node = node.id;
        obj.way = node.id;
        obj.currentValue = Infinity;
        obj.values = [];
        obj.links = data.links.filter(link => { // Danh sach cac dinh ke voi dinh hien tai
            return link.source === node.id;
        });
        obj.marked = false;
        nodes.push(obj);
    }

    for (let node of nodes) { // Moi vong lap se xuat phat tu 1 dinh khac nhau
        let otherNodes = _.cloneDeep( // Loc lay danh sach cac dinh con lai
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
            // Dieu kien dung: chung nao chua chon tat ca cac diem thi se khong dung lai
            for (let other of otherNodes) { // Xet cac diem con lai
                for (let link of currentNode.links) {
                    if (link.target === other.node) {
                        if ( // So sanh gia tri hien tai voi gia tri moi tai diem dang xet
                            other.currentValue > // va chon gia tri nho hon
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
                // Vong lap lay ra dinh co gia tri nho nhat lam dinh xuat phat trong buoc tiep theo
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
    // Cau truc du lieu cac doi tuong de hien thi len giao dien web
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
