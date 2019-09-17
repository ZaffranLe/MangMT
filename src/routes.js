import React from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Route } from "react-router-dom";
import ShortestPath from "./component/feature/shortest-path/ShortestPath";
import Schedule from "./component/feature/schedule/schedule";
import BinaryAlgorithms from "./component/feature/binary-algorithms/BinaryAlgorithms";
const Routes = () => {
  return (
    <>
      <Route path="/feature/dijkstra/" component={ShortestPath} />
      <Route path="/feature/schedule/" component={Schedule} />
      <Route path="/feature/binary-algorithms/" component={BinaryAlgorithms} />
    </>
  );
};

export default Routes;
