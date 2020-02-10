import NodeStates from "../path-finding-visualizer/node-states";
import MinHeap from "../data-structures/min-heap";

export function dijkstra(grid, startNode, endNode) {
    startNode.distance = 0;
    const unvisitedNodes = getAllNodesHeap(grid);
    const visitedNodesInOrder = [];

    while (unvisitedNodes.length !== 0) {

        const closestNode = unvisitedNodes.remove();
        const neighbours = getAvailableNeighboursHeap(closestNode, grid, unvisitedNodes);

        if (closestNode.nodeState === NodeStates.WALL) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;


        for (let i = 0; i < neighbours.length; i++) {

            if (neighbours[i].nodeState === NodeStates.WALL)
                continue

            if (neighbours[i].nodeState === NodeStates.VISITED)
                continue

            unvisitedNodes.changeDistance(neighbours[i], closestNode.distance + 1);
            unvisitedNodes.setPreviousNode(neighbours[i], closestNode);
        }

        closestNode.nodeState = NodeStates.VISITED;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === endNode)
            return visitedNodesInOrder;

    }
}

export function getShortestPath(endNode) {
    const shortestPath = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return shortestPath;
}

function getAvailableNeighboursHeap(node, grid, heap) {
    let neighbours = [];

    const topNeighbour = heap.getNodeAt(`${node.row - 1}:${node.col}`);
    if (topNeighbour !== undefined)
        neighbours.push(topNeighbour);

    const rightNeighbour = heap.getNodeAt(`${node.row}:${node.col + 1}`)
    if (rightNeighbour !== undefined)
        neighbours.push(rightNeighbour);

    const bottomNeighbour = heap.getNodeAt(`${node.row + 1}:${node.col}`)
    if (bottomNeighbour !== undefined)
        neighbours.push(bottomNeighbour);

    const leftNeighbour = heap.getNodeAt(`${node.row}:${node.col - 1}`)
    if (leftNeighbour !== undefined)
        neighbours.push(leftNeighbour);


    return neighbours.filter(
        neighbour => neighbours.nodeState !== NodeStates.VISITED
    );
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

function getAvailableNeighbours(node, grid) {
    let neighbours = [];

    // top neighbour
    if (node.row - 1 >= 0) neighbours.push(grid[node.row - 1][node.col]);

    // right neighbour
    if (node.col + 1 < grid[0].length)
        neighbours.push(grid[node.row][node.col + 1]);

    // bottom neighbour
    if (node.row + 1 < grid.length) neighbours.push(grid[node.row + 1][node.col]);

    // left neighbour
    if (node.col - 1 >= 0) neighbours.push(grid[node.row][node.col - 1]);

    return neighbours.filter(
        neighbour => neighbours.nodeState !== NodeStates.VISITED
    );
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