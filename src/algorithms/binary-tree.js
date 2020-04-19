import NodeStates from "../path-finding-visualizer/node-states";
import {
    setStartNode,
    setEndNode
} from '../path-finding-visualizer/grid-utilities'


export function executeBinaryTree(grid, startNode, endNode) {
    startNode.nodeState = NodeStates.UNVISITED;
    endNode.nodeState = NodeStates.UNVISITED
    startNode.closed = true;
    endNode.closed = true;

    for (let i = 1; i < grid.length; i += 2) {
        for (let j = 1; j < grid[0].length; j += 2) {
            let neighbours = [];

            if (i - 1 > 0)
                neighbours.push(grid[i - 1][j])
            if (j - 1 > 0)
                neighbours.push(grid[i][j - 1])

            if (grid[i][j] === grid[1][1])
                grid[i][j].closed = true;

            if (neighbours.length === 0)
                continue;

            startNode.nodeState = NodeStates.UNVISITED;
            endNode.NodeState = NodeStates.UNVISITED;

            const rand = neighbours[Math.floor(Math.random() * neighbours.length)];

            grid[i][j].closed = true;
            grid[rand.row][rand.col].closed = true;
        }
    }
    return getAllNodesInGrid(grid);
}

function getAllNodesInGrid(grid) {
    let newGrid = [];

    newGrid.push(grid[0][0]);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            newGrid.push(grid[i][j]);
        }
    }

    return newGrid.filter(
        (neighbour) => neighbour.closed === false
    );
}