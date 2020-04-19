import React, { Component } from "react";
import "./path-finding-visualizer.css";
import Grid from "./grid";
import NodeStates from "./node-states";
import {
  createGrid,
  replaceGrid,
  clearVisitedNodes,
  clearWallNodes,
} from "./grid-utilities";
import { executeBinaryTree } from '../algorithms/binary-tree'
import { executeRandom } from '../algorithms/random'
import { executeAStar, getShortestPath } from "../algorithms/a-star";
import { executeDijkstra } from "../algorithms/dijkstra";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/Dropdownbutton";

export default class PathFindindVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAlgo: executeDijkstra,
      selectedAlgoName: "Dijkstra",
      selectedMazeAlgo: executeBinaryTree,
      selectedMazeAlgoName: "Binary Tree",
      width: 0,
      height: 0,
      isVisualizing: false,
      startNodeIndex: { row: 10, col: 5 },
      endNodeIndex: { row: 10, col: 30 },
      grid: [],
    };

    this.visitedAnimationTimeout = []
    this.shortestPathTimeout = [];
    this.isMaze = false;
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateArrayLength();
    window.addEventListener("resize", this.updateWindowDimensions);
    const newGrid = createGrid(
      this.rowCount,
      this.colCount,
      this.state.startNodeIndex,
      this.state.endNodeIndex
    );
    this.setState({ selectedAlgo: executeDijkstra, selectedAlgoName: "Dijkstra" });
    this.setState({ grid: newGrid });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.updateArrayLength();
    this.reset();

    if (this.state.startNodeIndex.row < 0 ||
      this.state.startNodeIndex.row > this.state.grid.length - 1 ||
      this.state.startNodeIndex.col < 0 ||
      this.state.startNodeIndex.col > this.state.grid[0].length - 1 ||
      this.state.endNodeIndex.row < 0 ||
      this.state.endNodeIndex.row > this.state.grid.length - 1 ||
      this.state.endNodeIndex.col < 0 ||
      this.state.endNodeIndex.col > this.state.grid[0].length - 1) {
      this.setState({
        startNodeIndex: { row: Math.floor(0), col: Math.floor(0) },
        endNodeIndex: { row: Math.floor(this.rowCount - 1), col: Math.floor(this.colCount - 1) },
      })
      console.log("did resize")

    }

    const newGrid = createGrid(
      this.rowCount,
      this.colCount,
      this.state.startNodeIndex,
      this.state.endNodeIndex
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

    if (this.colCount % 2 === 0)
      this.colCount -= 1;

    if (this.rowCount % 2 === 0)
      this.rowCount -= 1;

    let root = document.documentElement;
    root.style.setProperty("--nodeSize", this.nodeSize + "px");
  }

  reset() {
    const newGrid = createGrid(
      this.rowCount,
      this.colCount,
      this.state.startNodeIndex,
      this.state.endNodeIndex
    );

    Array.from(this.shortestPathTimeout).forEach(element => {
      clearTimeout(element);
    });
    Array.from(this.visitedAnimationTimeout).forEach(element => {
      clearTimeout(element);
    })

    this.isMaze = false;
    this.setState({ grid: newGrid });
    clearVisitedNodes(this.state.grid, this.state.startNodeIndex, this.state.endNodeIndex);
    clearWallNodes(this.state.grid, this.state.startNodeIndex, this.state.endNodeIndex);
    this.setState({ isVisualizing: false });
  }

  executePathfinding() {
    if (this.state.isVisualizing) return;

    const grid = this.state.grid;
    const newGrid = replaceGrid(grid, this.state.startNodeIndex, this.state.endNodeIndex);

    clearVisitedNodes(newGrid, this.state.startNodeIndex, this.state.endNodeIndex);

    const visitedNodesInOrder = this.state.selectedAlgo(
      newGrid,
      newGrid[this.state.startNodeIndex.row][this.state.startNodeIndex.col],
      newGrid[this.state.endNodeIndex.row][this.state.endNodeIndex.col]
    );

    const shortestPathNodes = getShortestPath(
      newGrid[this.state.startNodeIndex.row][this.state.startNodeIndex.col],
      newGrid[this.state.endNodeIndex.row][this.state.endNodeIndex.col]
    );

    this.visualize(visitedNodesInOrder, shortestPathNodes);
  }

  // Visualize visited nodes and shortest path (by calling visualizeShortestPath) on
  visualize = (visitedNodesInOrder, shortestPath) => {
    this.setState({ isVisualizing: true });

    if (visitedNodesInOrder.length === 1) {
      this.setState({ isVisualizing: false });
      return;
    }

    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        this.shortestPathTimeout.push(setTimeout(() => {
          if (shortestPath !== null) this.visualizeShortestPath(shortestPath);
          return;
        }, 5 * i))
      }

      const row = visitedNodesInOrder[i].row;
      const col = visitedNodesInOrder[i].col;

      const node = document.getElementById(`${row}:${col}`);
      this.visitedAnimationTimeout.push(setTimeout(() => {
        visitedNodesInOrder[i].nodeState = NodeStates.VISITED;
        node.className = "VisitedNode";
      }, 5 * i))
    }
  }

  // Visualize shortestPath from array recieved in params
  visualizeShortestPath(shortestPath) {
    const grid = this.state.grid;
    this.setState({ isVisualizing: true });

    if (shortestPath.length === 1) {
      this.setState({ isVisualizing: false });
      return;
    }

    let toWaitBeforeEnded = 0;

    for (let i = 0; i < shortestPath.length; i++) {
      const row = shortestPath[i].row;
      const col = shortestPath[i].col;
      grid[row][col] = shortestPath[i];
      const node = document.getElementById(`${row}:${col}`);

      this.shortestPathTimeout.push(setTimeout(() => {
        if (node !== null) {
          shortestPath[i].nodeState = NodeStates.SHORTESTPATH;
          node.className = "ShortestPathNode";
        }
      }, 40 * i))
      toWaitBeforeEnded += 40;
    }

    setTimeout(() => {
      this.setState({ isVisualizing: false });
    }, toWaitBeforeEnded)
  }

  visualizeMaze() {
    if (this.state.isVisualizing) return;

    const newGrid = createGrid(
      this.rowCount,
      this.colCount,
      this.state.startNodeIndex,
      this.state.endNodeIndex
    );

    this.setState({ grid: newGrid });
    clearVisitedNodes(newGrid, this.state.startNodeIndex, this.state.endNodeIndex);
    clearWallNodes(newGrid, this.state.startNodeIndex, this.state.endNodeIndex);

    const maze = this.state.selectedMazeAlgo(
      newGrid,
      newGrid[this.state.startNodeIndex.row][this.state.startNodeIndex.col],
      newGrid[this.state.endNodeIndex.row][this.state.endNodeIndex.col]
    );

    this.setState({ isVisualizing: true });
    let toWaitBeforeEnded = 0;

    for (let i = 1; i < maze.length; i++) {
      const row = maze[i].row;
      const col = maze[i].col;
      const node = document.getElementById(`${row}:${col}`);
      if (this.isMaze) {
        maze[i].nodeState = NodeStates.WALL;
        node.className = "WallNode";
      } else {
        this.visitedAnimationTimeout.push(setTimeout(() => {
          maze[i].nodeState = NodeStates.WALL;
          node.className = "WallNode";
        }, 3 * i))
        toWaitBeforeEnded += 3;
      }
    }

    setTimeout(() => {
      this.setState({ isVisualizing: false });
    }, toWaitBeforeEnded)

    this.isMaze = true;
  }

  updateGrid = (newGrid) => {
    this.setState({ grid: newGrid });
  };

  updateStartEndIndex = (startNode, endNode) => {
    this.setState({ startNodeIndex: startNode })
    this.setState({ endNodeIndex: endNode });
  };

  selectAlgorithm = (selectedAlgo) => {
    if (selectedAlgo === "Dijkstra") this.setState({ selectedAlgo: executeDijkstra, selectedAlgoName: "Dijkstra" });
    if (selectedAlgo === "A*") this.setState({ selectedAlgo: executeAStar, selectedAlgoName: "A*" });
    if (selectedAlgo === "BinaryTree") this.setState({ selectedMazeAlgo: executeBinaryTree, selectedMazeAlgoName: "Binary Tree" })
    if (selectedAlgo === "Random") this.setState({ selectedMazeAlgo: executeRandom, selectedMazeAlgoName: "Random" })
  };

  render() {
    return (
      <div style={{ height: "100vh" }} className="PathFindingVisualizer">
        <div className="Header">
          <div className="TitleContainer">
            <h1 className="TitleText">Pathfinding Visualizer</h1>
          </div>

          <div className="DropDownContainer">
            <DropdownButton id="DropDown" title="Pathfinding Algorithm ">
              <Dropdown.Item id="MenuItem" onClick={() => this.selectAlgorithm('Dijkstra')}>Dijkstra's Algorithm</Dropdown.Item>
              <Dropdown.Item id="MenuItem" onClick={() => this.selectAlgorithm('A*')} as="button">A* Algorithm</Dropdown.Item>
            </DropdownButton>

            <button className="VisualizeButton" onClick={() => this.executePathfinding()}>Visualize {this.state.selectedAlgoName}</button>
            <button className="VisualizeButton" onClick={() => this.visualizeMaze()}>{this.state.selectedMazeAlgoName} Maze</button>

            <DropdownButton id="DropDown" title="Maze Algorithm ">
              <Dropdown.Item id="MenuItem" onClick={() => this.selectAlgorithm("BinaryTree")} as="button">Binary Tree</Dropdown.Item>
              <Dropdown.Item id="MenuItem" onClick={() => this.selectAlgorithm("Random")} as="button">Random</Dropdown.Item>

            </DropdownButton>

            <button className="ResetButton" onClick={() => this.reset()}>Reset</button>
          </div>
        </div>


        <Grid
          updateGrid={this.updateGrid}
          updateStartEndIndex={this.updateStartEndIndex}
          gridData={this.state.grid}
          startNodeIndex={this.state.startNodeIndex}
          endNodeIndex={this.state.endNodeIndex}
          isVisualizing={(this.state.isVisualizing)}
        />
      </div >
    );
  }
}
