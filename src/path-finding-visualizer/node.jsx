import React, { Component } from "react";
import "./grid.css";
import NodeStates from "./node-states";

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeState: NodeStates.UNVISITED,
      isStart: false,
      isEnd: false
    };
  }

  /** Make sure not all nodes update every time the grid renders */
  shouldComponentUpdate(nextProps) {
    const hasNodeStateChanged = this.props.nodeState !== nextProps.nodeState;

    return hasNodeStateChanged;
  }

  /** Change State based on property nodeState */
  static getDerivedStateFromProps(nextProps) {
    return {
      nodeState: nextProps.nodeState,
      isStart: nextProps.isStart,
      isEnd: nextProps.isEnd
    };
  }

  render() {
    const { row, col, onMouseDown, onMouseEnter, onMouseUp } = this.props;

    if (this.props.isStart) {
      return (
        <div
          id={`${row}:${col}`}
          onMouseUp={() => onMouseUp()}
          className="StartNode"
        ></div>
      );
    } else if (this.props.isEnd) {
      return (
        <div
          id={`${row}:${col}`}
          onMouseUp={() => onMouseUp()}
          className="EndNode"
        ></div>
      )}
    else if (this.state.nodeState === NodeStates.UNVISITED) {
      return (
        <div
          id={`${row}:${col}`}
          onMouseDown={() => onMouseDown(row, col)}
          onMouseUp={() => onMouseUp()}
          onMouseEnter={() => onMouseEnter(row, col)}
          onDragStart={this.preventDragHandler}
          className="Node"
        ></div>
      );
    } else if (this.state.nodeState === NodeStates.VISITED) {
      return <div onMouseUp={() => onMouseUp()} className="VisitedNode"></div>;
    } else if (this.state.nodeState === NodeStates.WALL) {
      return (
        <div
          onMouseUp={() => onMouseUp()}
          onMouseDown={() => onMouseDown()}
          className="WallNode"
        ></div>
      );
    } else {
      return <div>No Such State</div>;
    }
  }
}
