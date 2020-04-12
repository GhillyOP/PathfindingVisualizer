import React, { Component } from "react";
import "./path-finding-visualizer.css";
import Grid from "./grid";
import NodeStates from "./node-states";
import {
  createGrid,
  replaceGrid,
  clearVisitedNodes,
} from "./grid-utilities";
import { executeAStar, getShortestPath } from "../algorithms/a-star";
import { executeDijkstra } from "../algorithms/dijkstra";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/Dropdownbutton";

let FIRST_START_INDEX = [10, 5];
let FIRST_END_INDEX = [10, 30];

export default class PathFindindVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAlgo: executeDijkstra,
      selectedAlgoName: "Dijkstra",
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
    this.setState({selectedAlgo: executeDijkstra, selectedAlgoName: "Dijkstra"});
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

    const visitedNodesInOrder = this.state.selectedAlgo(
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
    this.setState({ grid: newGrid });
  };

  updateStartEndIndex = (startNode, endNode) => {
    this.startNodeIndex = startNode;
    this.endNodeIndex = endNode;
  };

  selectAlgorithm = (selectedAlgo) => {
    if (selectedAlgo === "Dijkstra")  this.setState({selectedAlgo: executeDijkstra, selectedAlgoName: "Dijkstra"});


    if (selectedAlgo === "A*")  this.setState({selectedAlgo: executeAStar, selectedAlgoName: "A*"});

  };

  render() {
    
    return (
      <div style = {{height:"100vh"}} className="PathFindingVisualizer">
        <div className="Header">
          <div className="TitleContainer">
            <h1 className="TitleText">Pathfinding Visualizer</h1>
          </div>
          <div className="DropDownContainer">
            <DropdownButton id="DropDown" title="Pathfinding">
                <Dropdown.Item id="MenuItem" onClick={()=> this.selectAlgorithm('Dijkstra')}>Dijkstra's Algorithm</Dropdown.Item>
                <Dropdown.Item id="MenuItem" onClick={()=> this.selectAlgorithm('A*')} as="button">A* Algorithm</Dropdown.Item>
            </DropdownButton>

              {/* <DropdownButton id="DropDown" title="Select Maze  ">
                <Dropdown.Item id="MenuItem" as="button">Array</Dropdown.Item>
                <Dropdown.Item id="MenuItem" as="button">Heap</Dropdown.Item>
              </DropdownButton> */}

            <button className="VisualizeButton" onClick={() => this.executePathfinding()}>Visualize { this.state.selectedAlgoName }</button>
            <button className="ResetButton" onClick={() => this.reset()}>Reset</button>
          </div>
        </div>


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
