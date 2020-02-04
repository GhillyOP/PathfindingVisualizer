import React, { Component } from "react";
import "./path-finding-visualizer.css";
import Grid from "./grid";

export default class PathFindindVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="PathFindingVisualizer">
        <Grid />
      </div>
    );
  }
}
