import NodeStates from "../path-finding-visualizer/node-states"
import MinHeap from '../data-structures/min-heap'

export function dijkstra(grid, startNode, endNode) {

    startNode.distance = 0;
    const unvisitedNodes = getAllNodesHeap(grid);
    const visitedNodesInOrder = []

    while (unvisitedNodes.length !== 0) {
        // sortNodesByDistance(unvisitedNodes);
        // const closestNode = unvisitedNodes.shift();
        const closestNode = unvisitedNodes.remove();

        // const neighbours = getAvailableNeighbours(closestNode, grid)
        const neighbours = getAvailableNeighboursHeap(closestNode, grid)

        if (closestNode.nodeState === NodeStates.WALL) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        // for (let i = 0; i < neighbours.length; i++) {

        //     let closestNodeDist = closestNode.distance + 1;

        //     neighbours[i].distance = closestNodeDist;
        //     neighbours[i].previousNode = closestNode;
        // }

        for (let i = 0; i < neighbours.length; i++) {

            let closestNodeDist = closestNode.distance + 1;

            // console.log(neighbours[i])

            unvisitedNodes.changeDistance(neighbours[i], closestNodeDist);
            unvisitedNodes.setPreviousNode(neighbours[i], closestNode);
        }

        closestNode.nodeState = NodeStates.VISITED;
        visitedNodesInOrder.push(closestNode)

        if (closestNode === endNode) return visitedNodesInOrder;
    }
}

function getAvailableNeighbours(node, grid) {
    let neighbours = [];

    // top neighbour
    if ((node.row - 1) >= 0)
        neighbours.push(grid[node.row - 1][node.col]);

    // right neighbour
    if (node.col + 1 < grid[0].length)
        neighbours.push(grid[node.row][node.col + 1]);

    // bottom neighbour
    if (node.row + 1 < grid.length)
        neighbours.push(grid[node.row + 1][node.col]);

    // left neighbour
    if (node.col - 1 >= 0)
        neighbours.push(grid[node.row][node.col - 1]);

    return neighbours.filter(neighbour => neighbours.nodeState !== NodeStates.VISITED);
}

function getAvailableNeighboursHeap(node, grid) {
    let neighboursIndexes = [];

    if ((node.row - 1) >= 0)
        neighboursIndexes.push(`${node.row - 1}:${node.col}`);

    if (node.col + 1 < grid[0].length)
        neighboursIndexes.push(`${node.row}:${node.col + 1}`);

    if (node.row + 1 < grid.length)
        neighboursIndexes.push(`${node.row + 1}:${node.col}`);

    if (node.col - 1 >= 0)
        neighboursIndexes.push(`${node.row}:${node.col - 1}`);

    return neighboursIndexes
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(grid) {
    const nodes = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            nodes.push(grid[row][col]);
        }
    }

    return nodes;
}

function getAllNodesHeap(grid) {
    const nodes = new MinHeap();
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            nodes.insert(grid[row][col]);
        }
    }
    return nodes;
}