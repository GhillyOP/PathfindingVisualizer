import React, { Component } from "react";
import "./path-finding-visualizer.css";
import Grid from "./grid";
import NodeStates from "./node-states";
import {
  createGrid,
  replaceGrid,
  setNodeInGrid,
  setStartNode,
  setEndNode,
  clearVisitedNodes,
} from "./grid-utilities";
import { executeAStar, getShortestPath } from "../algorithms/a-star";
import Dropdown from "react-bootstrap/Dropdown";

let FIRST_START_INDEX = [10, 5];
let FIRST_END_INDEX = [10, 30];

export default class PathFindindVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      grid: [],
    };

    this.startNodeIndex = {
      row: FIRST_START_INDEX[0],
      col: FIRST_START_INDEX[1],
    };

    this.endNodeIndex = {
      row: FIRST_END_INDEX[0],
      col: FIRST_END_INDEX[1],
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateArrayLength();
    window.addEventListener("resize", this.updateWindowDimensions);
    const newGrid = createGrid(
      this.rowCount,
      this.colCount,
      this.startNodeIndex,
      this.endNodeIndex
    );
    this.setState({ grid: newGrid });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.updateArrayLength();
    const newGrid = createGrid(
      this.rowCount,
      this.colCount,
      this.startNodeIndex,
      this.endNodeIndex
    );
    this.setState({
      grid: newGrid,
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  updateArrayLength() {
    this.nodeSize = 24;
    this.rowCount = Math.floor(
      (window.innerHeight - window.innerHeight / 5) / this.nodeSize
    );
    this.colCount = Math.floor(
      (window.innerWidth - window.innerWidth / 18) / this.nodeSize
    );

    let root = document.documentElement;
    root.style.setProperty("--nodeSize", this.nodeSize + "px");
  }

  reset() {
    const newGrid = createGrid(
      this.rowCount,
      this.colCount,
      this.startNodeIndex,
      this.endNodeIndex
    );
    this.setState({ grid: newGrid });
    clearVisitedNodes(this.state.grid, this.startNodeIndex, this.endNodeIndex);
    this.isVisusualizing = false;
    clearTimeout(this.visitedAnimationTimeout);
    clearTimeout(this.shortestPathTimeout);
  }

  executePathfinding() {
    if (this.isVisusualizing) return;

    const grid = this.state.grid;
    const newGrid = replaceGrid(grid, this.startNodeIndex, this.endNodeIndex);

    clearVisitedNodes(newGrid, this.startNodeIndex, this.endNodeIndex);

    const visitedNodesInOrder = executeAStar(
      newGrid,
      newGrid[this.startNodeIndex.row][this.startNodeIndex.col],
      newGrid[this.endNodeIndex.row][this.endNodeIndex.col]
    );

    const shortestPathNodes = getShortestPath(
      newGrid[this.startNodeIndex.row][this.startNodeIndex.col],
      newGrid[this.endNodeIndex.row][this.endNodeIndex.col]
    );

    this.visualize(visitedNodesInOrder, shortestPathNodes);
  }

  // Visualize visited nodes and shortest path (by calling visualizeShortestPath) on
  visualize(visitedNodesInOrder, shortestPath) {
    this.isVisusualizing = true;

    if (visitedNodesInOrder.length === 1) {
      this.isVisusualizing = false;
      return;
    }

    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        this.shortestPathTimeout = setTimeout(() => {
          if (shortestPath !== null) this.visualizeShortestPath(shortestPath);
          return;
        }, 5 * i);
      }

      const row = visitedNodesInOrder[i].row;
      const col = visitedNodesInOrder[i].col;

      const node = document.getElementById(`${row}:${col}`);
      this.visitedAnimationTimeout = setTimeout(() => {
        visitedNodesInOrder[i].nodeState = NodeStates.VISITED;
        node.className = "VisitedNode";
      }, 5 * i);
    }
  }

  // Visualize shortestPath from array recieved in params
  visualizeShortestPath(shortestPath) {
    const grid = this.state.grid;
    this.isVisusualizing = true;

    if (shortestPath.length === 1) {
      this.isVisusualizing = false;
      return;
    }

    for (let i = 0; i < shortestPath.length; i++) {
      const row = shortestPath[i].row;
      const col = shortestPath[i].col;
      grid[row][col] = shortestPath[i];
      const node = document.getElementById(`${row}:${col}`);

      setTimeout(() => {
        if (node !== null) {
          shortestPath[i].nodeState = NodeStates.SHORTESTPATH;
          node.className = "ShortestPathNode";
        }
        if (i === shortestPath.length - 1) {
          this.isVisusualizing = false;
        }
      }, 40 * i);
    }
  }

  updateGrid = (newGrid) => {
    console.log("GRID SHOULD UPDATE");
    this.setState({ grid: newGrid });
  };

  updateStartEndIndex = (startNode, endNode) => {
    this.startNodeIndex = startNode;
    this.endNodeIndex = endNode;
  };

  render() {
    return (
      <div className="PathFindingVisualizer">
        <div className="DropDownDiv">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <button onClick={() => this.executePathfinding()}>Visualize</button>
        <button onClick={() => this.reset()}>Reset</button>

        <Grid
          updateGrid={this.updateGrid}
          updateStartEndIndex={this.updateStartEndIndex}
          gridData={this.state.grid}
          startNodeIndex={this.startNodeIndex}
          endNodeIndex={this.endNodeIndex}
        />
      </div>
    );
  }
}
