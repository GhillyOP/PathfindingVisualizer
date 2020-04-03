import NodeStates from "../path-finding-visualizer/node-states";
import MinHeap from "../data-structures/min-heap";

export function executeAStar(grid, startNode, endNode) {

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            grid[i][j].distance = 0;
        }
    }

    var t0 = performance.now();

    // init open and closed lists
    startNode.distance = 0;
    let open = new MinHeap();
    let closed = [];

    // add start node to open
    open.insert(startNode);

    // while open is not empty
    while (open.map.size > 0) {

        // remove the node with the smallest fCost
        let closestNode = open.remove();
        closed.push(closestNode);

        if (closestNode === endNode) {
            var t1 = performance.now();
            console.log("AStar Took " + (t1 - t0) + " milliseconds.");
            return closed;
        }

        if (closestNode.nodeState === NodeStates.WALL) {
            continue;
        }

        if (closestNode.distance === Infinity) {
            console.log("NO PATH");
            return closed;
        }

        closestNode.nodeState = NodeStates.VISITED

        const neighbours = getAvailableNeighbours(closestNode, grid);
        for (let i = 0; i < neighbours.length; i++) {
            if (closed.includes(neighbours[i]) || neighbours[i].nodeState === NodeStates.WALL) {
                continue;
            }

            // let gCost = closestNode.gCost + 10;
            let gCost = closestNode.gCost + getNewGCost(neighbours[i], closestNode);


            if (open.getNodeAt(`${neighbours[i].row}:${neighbours[i].col}`) === undefined || gCost < neighbours[i].gCost) {

                neighbours[i].previousNode = closestNode;
                neighbours[i].hCost = getManhattanHCost(neighbours[i], endNode);
                neighbours[i].gCost = gCost;
                neighbours[i].distance = neighbours[i].gCost + neighbours[i].hCost;

                if (open.getNodeAt(`${neighbours[i].row}:${neighbours[i].col}`) === undefined) {
                    open.insert(neighbours[i]);
                } else if (open.getNodeAt(`${neighbours[i].row}:${neighbours[i].col}`) !== undefined) {
                    open.changeDistance(neighbours[i], neighbours[i].distance);
                }
            }
        }
    }
    return closed;
}

export function getAvailableNeighbours(node, grid) {
    let neighbours = [];

    if (node.row - 1 >= 0)
        neighbours.push(grid[node.row - 1][node.col]);

    if (node.col + 1 < grid[0].length)
        neighbours.push(grid[node.row][node.col + 1]);

    if (node.row + 1 < grid.length)
        neighbours.push(grid[node.row + 1][node.col]);

    if (node.col - 1 >= 0)
        neighbours.push(grid[node.row][node.col - 1]);

    return neighbours;
}

const getManhattanHCost = (currentNode, destNode) => {
    const y = Math.abs(currentNode.row - destNode.row);
    const x = Math.abs(currentNode.col - destNode.col);
    return (x + y) * 9.9;
}


const getNewGCost = (currentNode, closestNode) => {
    if(closestNode.previousNode === null){
        return 10;
    }

    let firstDirection = [closestNode.previousNode.row - closestNode.row, closestNode.previousNode.col - closestNode.col];
    let secondDirection = [closestNode.row - currentNode.row, closestNode.col - currentNode.col];

    if (firstDirection[0] === secondDirection[0] && firstDirection[1] === secondDirection[1]) {
        return 9;
    } else {
        return 10;
    }
}

export const getShortestPath = (startNode, endNode) => {
    const shortestPath = [];
    let currentNode = endNode;
    while (currentNode !== startNode) {
        if (currentNode === null || currentNode === undefined) break;
        currentNode.nodeState = NodeStates.SHORTESTPATH;
        shortestPath.push(currentNode);
        currentNode = currentNode.previousNode;
    }
    shortestPath.push(startNode);
    return shortestPath.reverse();
}