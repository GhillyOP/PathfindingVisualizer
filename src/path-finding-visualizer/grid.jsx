import React, { Component } from "react";
import Node from "./node";
import NodeStates from "./node-states";
import "./grid.css";
import Dijkstra from "../algorithms/dijkstra";

let START_INDEX = [10, 5];
let END_INDEX = [10, 30];

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0, grid: [], isMouseDown: false };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.updateArrayLength();
  }

  // general method to visualize any pathfinding algorithm
  executePathfinding(algo) {
    const grid = this.state.grid;

    // let dijkstra = new Dijkstra(grid, grid[10][5], grid[10][30])

    let visitedNodesInOrder = algo.execute();
    let shortestPathNodes = algo.getShortestPath(grid[10][30]);
    this.visualize(visitedNodesInOrder, shortestPathNodes);
  }

  // Visualize visited nodes and shortest path (by calling visualizeShortestPath) on
  visualize(visitedNodesInOrder, shortestPath) {
    const grid = this.state.grid;
    this.isVisusualizing = true;

    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          if(shortestPath !== null)
            this.visualizeShortestPath(shortestPath);
        }, 5 * i);
        return;
      }

      const row = visitedNodesInOrder[i].row;
      const col = visitedNodesInOrder[i].col;

      grid[row][col] = visitedNodesInOrder[i];
      const node = document.getElementById(`${row}:${col}`);

      setTimeout(() => {
        if (node !== null) node.className = "VisitedNode";
        if (i === visitedNodesInOrder.length - 1) this.isVisusualizing = false;
      }, 5 * i);
    }
  }

  // Visualize shortestPath from array recieved in params
  visualizeShortestPath(shortestPath) {
    const grid = this.state.grid;
    for (let i = 0; i < shortestPath.length; i++) {
      const row = shortestPath[i].row;
      const col = shortestPath[i].col;
      grid[row][col] = shortestPath[i];
      const node = document.getElementById(`${row}:${col}`);

      setTimeout(() => {
        if (node !== null) node.className = "ShortestPathNode";
        if (i === shortestPath.length - 1) this.isVisusualizing = false;
      }, 40 * i);
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);

    const newGrid = createGrid(
      this.rowCount,
      this.colCount,
      this.nodeSize
    );
    this.setState({ grid: newGrid });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.updateArrayLength();

    this.setState({
      grid: createGrid(
        this.rowCount,
        this.colCount,
        this.nodeSize
      )
    });

    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  updateArrayLength() {
    this.nodeSize = 28;
    this.rowCount =
      (window.innerHeight - window.innerHeight / 5) / this.nodeSize;
    this.colCount =
      (window.innerWidth - window.innerWidth / 16) / this.nodeSize;
  }

  handleMouseDown(row, col) {
    if (this.isVisusualizing) return;

    const newGrid = setNodeInGrid(this.state.grid, row, col);
    this.setState({ grid: newGrid, isMouseDown: true });
  }

  handleMouseUp() {
    if (this.isVisusualizing) return;

    this.setState({ isMouseDown: false });
  }

  handleMouseEnter(row, col) {
    const grid = this.state.grid;

    if (this.isVisusualizing) return;

    if (this.state.isMouseDown) {
      const newGrid = setNodeInGrid(grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  preventDragHandler = e => {
    e.preventDefault();
  };

  renderGrid() {
    return (
      <div className="Grid">
        <button
          onClick={() =>
            this.executePathfinding(new Dijkstra(this.state.grid, this.state.grid[10][5], this.state.grid[10][30]))
          }
        >
          Visualize
        </button>
        {this.state.grid.map((row, rowI) => {
          return (
            <div key={rowI}>
              {row.map((node, nodeI) => (
                <Node
                  col={node.col}
                  row={node.row}
                  isStart={node.isStart}
                  isEnd={node.isEnd}
                  nodeState={node.nodeState}
                  onMouseUp={() => this.handleMouseUp()}
                  onMouseDown={() => this.handleMouseDown(node.row, node.col)}
                  onMouseEnter={() => this.handleMouseEnter(node.row, node.col)}
                  onDragStart={this.preventDragHandler} // prevents drag on this component
                  key={nodeI}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return this.renderGrid();
  }
}

const createGrid = (rowCount, colCount) => {
  let grid = [];
  for (let i = 0; i < rowCount; i++) {
    let row = [];

    for (let j = 0; j < colCount; j++) {
      row.push(createNode(j, i));
    }
    grid.push(row);
  }

  return grid;
}

const  createNode = (col, row) => {
  let isStart = false;
  let isEnd = false;

  if (row === START_INDEX[0] && col === START_INDEX[1]) isStart = true;
  else if (row === END_INDEX[0] && col === END_INDEX[1]) isEnd = true;

  return {
    row,
    col,
    isStart: isStart,
    isEnd: isEnd,
    distance: Infinity,
    previousNode: null,
    nodeState: NodeStates.UNVISITED
  };
}

const setNodeInGrid = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];

  let nodeState;

  if (node.nodeState === NodeStates.WALL) nodeState = NodeStates.UNVISITED;
  else if (node.nodeState === NodeStates.UNVISITED) nodeState = NodeStates.WALL;

  const newNode = {
    ...node,
    nodeState: nodeState
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
