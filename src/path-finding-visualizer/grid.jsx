import React, { Component } from "react";
import Node from "./node";
import NodeStates from "./node-states";
import "./grid.css";
import {
  createGrid,
  replaceGrid,
  setNodeInGrid,
  setStartNode,
  setEndNode,
  clearVisitedNodes,
} from "./grid-utilities";

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMouseDown: false,
    };
  }

  handleMouseDown = (row, col) => {
    if (this.isVisusualizing) return;

    // set nextNodeState depending on current state of the node
    let nextNodeState = NodeStates.WALL;
    if (this.props.gridData[row][col].nodeState === NodeStates.WALL) {
      nextNodeState = NodeStates.UNVISITED;
    }

    // set beginDragStart on StartNode click
    if (this.props.gridData[row][col].isStart) {
      this.beginDragStart = true;
      return;
    }

    // set beginDragEnd on EndNode click
    if (this.props.gridData[row][col].isEnd) {
      this.beginDragEnd = true;
      return;
    }

    // set State to t
    this.tempGrid = setNodeInGrid(this.props.gridData, row, col, nextNodeState);
    this.setState({ isMouseDown: true });
  };

  handleMouseDownIntersect = () => {
    if (this.isVisusualizing) return;
    this.tempGrid = this.props.gridData;
    this.setState({ isMouseDown: true });
  };

  handleMouseLeave = () => {
    if (this.isVisusualizing) return;
    this.setState({ isMouseDown: false });
  };

  handleMouseUp() {
    if (this.isVisusualizing) return;
    if (!this.state.isMouseDown) return;

    if (this.beginDragStart) this.beginDragStart = false;
    else if (this.beginDragEnd) this.beginDragEnd = false;

    // set new grid and isMouseDown in state
    this.setState({ isMouseDown: false });

    this.props.updateGrid(this.tempGrid);
    this.props.updateStartEndIndex(
      this.props.startNodeIndex,
      this.props.endNodeIndex
    );
  }

  handleMouseEnter = (row, col) => {
    if (this.isVisusualizing) return;
    if (!this.state.isMouseDown) return;

    const node = document.getElementById(`${row}:${col}`);
    const grid = this.tempGrid;

    if (this.beginDragStart) {
      node.className = "StartNode";
      this.tempGrid = setStartNode(
        this.props.gridData,
        row,
        col,
        this.props.startNodeIndex
      );
      return;
    } else if (this.beginDragEnd) {
      node.className = "EndNode";
      this.tempGrid = setEndNode(
        this.props.gridData,
        row,
        col,
        this.props.endNodeIndex
      );
      return;
    } else if (this.state.isMouseDown) {
      node.className = "WallNode";
      this.tempGrid = setNodeInGrid(grid, row, col, NodeStates.WALL);
    }
  };

  preventDragHandler = (e) => {
    e.preventDefault();
  };

  renderGrid() {
    return (
      <div className="GridContainer">
        <div
          className="Grid"
          onDragStart={this.preventDragHandler}
          onMouseLeave={this.handleMouseLeave}
          onMouseUp={() => this.handleMouseUp()}
          onMouseDown={() => this.handleMouseDownIntersect()}
        >
          {this.props.gridData.map((row, rowI) => {
            return (
              <div key={rowI}>
                {row.map((node, nodeI) => (
                  <Node
                    col={node.col}
                    row={node.row}
                    isStart={node.isStart}
                    isEnd={node.isEnd}
                    isWall={node.isWall}
                    shouldUpdate={node.shouldUpdate}
                    nodeState={node.nodeState}
                    closed={node.closed}
                    onMouseUp={() => this.handleMouseUp()}
                    onMouseDown={() => this.handleMouseDown(node.row, node.col)}
                    onMouseEnter={() => this.handleMouseEnter(node.row, node.col)}
                    onMouseLeave={() =>
                      this.handleMouseLeave(node, row, node.col)
                    }
                    onDragStart={this.preventDragHandler} // prevents drag on this component
                    key={`${node.row}:${node.col}`}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

    );
  }

  render() {
    return this.renderGrid();
  }
}
