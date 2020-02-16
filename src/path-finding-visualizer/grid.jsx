import React, { Component } from "react";
import Node from "./node";
import NodeStates from "./node-states";
import "./grid.css";
import {execute, getShortestPath} from "../algorithms/dijkstra";

let START_INDEX = [10, 5];
let END_INDEX = [10, 30];

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      grid: [],
      isMouseDown: false
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.updateArrayLength();
  }

  // general method to visualize any pathfinding algorithm
  executePathfinding() {
    clearVisitedNodes(this.state.grid);
    this.setState({grid: replaceGrid(this.state.grid)}, () => {

      const visitedNodesInOrder = execute(this.state.grid, this.state.grid[10][5], this.state.grid[10][30]);
      const shortestPathNodes = getShortestPath(this.state.grid[10][30]);
      this.visualize(visitedNodesInOrder, shortestPathNodes);

    })


  }

  // Visualize visited nodes and shortest path (by calling visualizeShortestPath) on
  visualize(visitedNodesInOrder, shortestPath) {
    this.isVisusualizing = true;

    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          if (shortestPath !== null) this.visualizeShortestPath(shortestPath);
        }, 5 * i);
        return;
      }

      const row = visitedNodesInOrder[i].row;
      const col = visitedNodesInOrder[i].col;

      const node = document.getElementById(`${row}:${col}`);
      setTimeout(() => {
          node.className = "VisitedNode";
        if (i === visitedNodesInOrder.length - 1) {
          this.isVisusualizing = false;
        }
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
        if (i === shortestPath.length - 1) {
          this.isVisusualizing = false;
        }
      }, 40 * i);
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    const newGrid = createGrid(this.rowCount, this.colCount, this.nodeSize);
    this.setState({ grid: newGrid });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.updateArrayLength();

    this.setState({
      grid: createGrid(this.rowCount, this.colCount, this.nodeSize)
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
        <button onClick={() => this.executePathfinding()}>Visualize</button>
        {this.state.grid.map((row, rowI) => {
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
                  onMouseUp={() => this.handleMouseUp()}
                  onMouseDown={() => this.handleMouseDown(node.row, node.col)}
                  onMouseEnter={() => this.handleMouseEnter(node.row, node.col)}
                  onDragStart={this.preventDragHandler} // prevents drag on this component
                  key={`${node.row}:${node.col}`}
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
};

const createNode = (col, row) => {
  let isStart = false;
  let isEnd = false;

  if (row === START_INDEX[0] && col === START_INDEX[1]) isStart = true;
  else if (row === END_INDEX[0] && col === END_INDEX[1]) isEnd = true;

  return {
    row,
    col,
    isStart: isStart,
    isEnd: isEnd,
    isWall: false,
    shouldUpdate: false,
    distance: Infinity,
    previousNode: null,
    nodeState: NodeStates.UNVISITED
  };
};

const setNodeInGrid = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];

  let nodeState;

  if (node.nodeState === NodeStates.WALL) nodeState = NodeStates.UNVISITED;
  else nodeState = NodeStates.WALL;

  const newNode = {
    ...node,
    nodeState: nodeState
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const replaceGrid = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if(grid[i][j].nodeState === NodeStates.WALL){
        grid[i][j].nodeState = NodeStates.WALL;
      }
      else{
        grid[i][j] = createNode(j, i);
      }
    }
  }
  return grid;
};

const clearVisitedNodes = grid => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const node = document.getElementById(`${i}:${j}`);

      if (i === START_INDEX[0] && j === START_INDEX[1]) continue;
      if (i === END_INDEX[0] && j === END_INDEX[1]) continue;

      if (grid[i][j].nodeState === NodeStates.WALL) {
        node.className = "WallNode";
      } else if (grid[i][j].nodeState === NodeStates.VISITED) {
        node.className = "Node";
      }
    }
  }
};
