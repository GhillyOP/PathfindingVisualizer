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

  handleMouseDown(row, col) {
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
  }

  handleMouseLeave = (row, col) => {
    if (this.isVisusualizing) return;
    this.setState({ isMouseDown: false });
  };

  handleMouseUp() {
    if (this.isVisusualizing) return;

    if (this.beginDragStart) this.beginDragStart = false;
    else if (this.beginDragEnd) this.beginDragEnd = false;

    // set new grid and isMouseDown in state
    this.setState({ grid: this.tempGrid, isMouseDown: false });

    if (this.tempGrid !== null && this.tempGrid !== undefined)
      this.props.updateGrid(this.tempGrid);
    this.props.updateStartEndIndex(
      this.props.startNodeIndex,
      this.props.endNodeIndex
    );
  }

  handleMouseEnter(row, col) {
    if (this.isVisusualizing) return;

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
  }

  preventDragHandler = (e) => {
    e.preventDefault();
  };

  renderGrid() {
    return (
      <div
        className="Grid"
        onDragStart={this.preventDragHandler}
        onMouseLeave={this.handleMouseLeave}
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
    );
  }

  render() {
    return this.renderGrid();
  }
}

// const createGrid = (rowCount, colCount) => {
//   let grid = [];
//   for (let i = 0; i < rowCount; i++) {
//     let row = [];

//     for (let j = 0; j < colCount; j++) {
//       row.push(createNode(i, j));
//     }
//     grid.push(row);
//   }

//   return grid;
// };

// const createNode = (row, col) => {
//   let isStart = false;
//   let isEnd = false;

//   if (row === startNodeIndex.row && col === startNodeIndex.col) isStart = true;
//   else if (row === endNodeIndex.row && col === endNodeIndex.col) isEnd = true;

//   return {
//     row,
//     col,
//     isStart: isStart,
//     isEnd: isEnd,
//     distance: Infinity,
//     gCost: 0,
//     hCost: 0,
//     previousNode: null,
//     nodeState: NodeStates.UNVISITED
//   };
// };

// const setNodeInGrid = (grid, row, col, nodeState) => {
//   // const newGrid = grid;
//   const node = grid[row][col];

//   // if (node.nodeState === NodeStates.WALL) nodeState = NodeStates.UNVISITED;
//   // else nodeState = NodeStates.WALL;

//   const newNode = {
//     ...node,
//     nodeState: nodeState
//   };
//   grid[row][col] = newNode;
//   return grid;
// };

// const setStartNode = (grid, row, col) => {
//   const newGrid = grid;
//   const node = newGrid[row][col];

//   const newStartNode = {
//     ...node,
//     isStart: true
//   };

//   newGrid[row][col] = newStartNode;
//   newGrid[startNodeIndex.row][startNodeIndex.col].isStart = false;
//   document.getElementById(
//     `${startNodeIndex.row}:${startNodeIndex.col}`
//   ).className = "Node";

//   startNodeIndex.row = row;
//   startNodeIndex.col = col;

//   return newGrid;
// };

// const setEndNode = (grid, row, col) => {
//   const newGrid = grid;
//   const node = newGrid[row][col];

//   const newEndNode = {
//     ...node,
//     isEnd: true
//   };

//   newGrid[row][col] = newEndNode;
//   newGrid[endNodeIndex.row][endNodeIndex.col].isEnd = false;
//   document.getElementById(`${endNodeIndex.row}:${endNodeIndex.col}`).className =
//     "Node";

//   endNodeIndex.row = row;
//   endNodeIndex.col = col;

//   return newGrid;
// };

// const replaceGrid = grid => {
//   for (let i = 0; i < grid.length; i++) {
//     for (let j = 0; j < grid[0].length; j++) {
//       if (grid[i][j].nodeState === NodeStates.WALL) {
//         grid[i][j] = createNode(i, j);
//         grid[i][j].nodeState = NodeStates.WALL;
//       } else {
//         grid[i][j] = createNode(i, j);
//       }
//     }
//   }
//   return grid;
// };

// const clearVisitedNodes = grid => {
//   for (let i = 0; i < grid.length; i++) {
//     for (let j = 0; j < grid[0].length; j++) {
//       const node = document.getElementById(`${i}:${j}`);

//       if (i === startNodeIndex.row && j === startNodeIndex.col) {
//         node.className = "StartNode";
//         continue;
//       }
//       if (i === endNodeIndex.row && j === endNodeIndex.col) {
//         node.className = "EndNode";
//         continue;
//       }
//       if (grid[i][j].nodeState === NodeStates.WALL) {
//         continue;
//       } else {
//         node.className = "Node";
//       }
//     }
//   }
// };
