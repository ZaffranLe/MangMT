const _ = require("lodash");

export default function bellmanFord(data) {
  const bellmanFordResult = [];
  const originalNodes = [];
  for (let node of data.nodes) { // Cau truc du lieu cua 1 dinh
    let obj = {};
    obj.node = node.id;
    obj.way = node.id;
    obj.currentValue = 0;
    obj.links = data.links.filter(link => { // Danh sach cac dinh ke voi dinh hien tai
      return link.source === node.id;
    });
    obj.marked = false;
    originalNodes.push(obj);
  }

  for (let originalNode of originalNodes) { // Moi vong lap se xuat phat tu 1 dinh moi
    const results = [];
    let startNode = _.cloneDeep(originalNode);
    let firstNodes = [];
    let originalNodesClone = _.cloneDeep(originalNodes);

    for (let link of startNode.links) { // Lay ra danh sach dinh ke voi dinh xuat phat
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

      while (currentNodes.length > 0) { // Dieu kien dung: chi khi duong di ngan nhat toi cac dinh khac
                                       // da duoc thiet lap
        for (let currentNode of currentNodes) { 
          currentNode.marked = false;
          for (let link of currentNode.links) {
            for (let otherNode of nodes) {
              if (link.target === otherNode.node) {
                if (link.target !== firstNode.node) {
                  if ( // So sanh trong so hien tai cua dinh dang xet voi trong so moi no se nhan
                    otherNode.currentValue === 0 || // neu trong so moi co gia tri nho hon thi tien hanh cap nhat
                    otherNode.currentValue >
                      currentNode.currentValue + parseInt(link.distance, 10)
                  ) {
                    otherNode.currentValue =
                      currentNode.currentValue + parseInt(link.distance, 10);
                    otherNode.marked = true; // Danh dau rang diem dang xet vua duoc cap nhat gia tri moi (1)
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
        for (let node of nodes) { // Cac diem vua duoc danh dau o (1) se thuc hien tinh toan lai
                                 // do dai toi cac dinh khac
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
    
    // Cau truc du lieu cac doi tuong de hien thi ket qua len giao dien web
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
      if (node["values"].length > 0) { // Tim gia tri duong di ngan nhat
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
    let singleResult = {}; // Cau truc du lieu hien thi duong di ngan nhat xuat phat tu 1 diem cu the
    singleResult["firstNodes"] = _.cloneDeep(firstNodes); // Diem xuat phat
    singleResult["startNode"] = _.cloneDeep(startNode); // Danh sach cac diem ke voi diem xuat phat
    singleResult["nodeList"] = nodeList.filter(node => { // Gia tri duong di ngan nhat toi cac diem con lai
      return node["values"].length > 0;
    });
    bellmanFordResult.push(singleResult);
  }
  return bellmanFordResult; // Ket qua cuoi cung
}
