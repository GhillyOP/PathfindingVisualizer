import NodeStates from "../path-finding-visualizer/node-states";


export function executeRandom(grid, startNode, endNode) {
    startNode.nodeState = NodeStates.UNVISITED;
    endNode.nodeState = NodeStates.UNVISITED

    startNode.closed = true;
    endNode.closed = true;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const rand = Math.random();
            if(rand > 0.3333333) grid[i][j].closed = true;
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