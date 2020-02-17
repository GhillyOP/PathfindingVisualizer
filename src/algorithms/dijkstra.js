import NodeStates from "../path-finding-visualizer/node-states";
import MinHeap from "../data-structures/min-heap";

export function execute(grid, startNode, endNode) {
    startNode.distance = 0;
    let unvisitedNodes = new MinHeap();
    unvisitedNodes = getAllNodesHeap(grid);
    const visitedNodesInOrder = [];

    while (unvisitedNodes.length !== 0) {

        const closestNode = unvisitedNodes.remove();
        const neighbours = getAvailableNeighboursHeap(closestNode, unvisitedNodes);

        if (closestNode.nodeState === NodeStates.WALL) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        for (let i = 0; i < neighbours.length; i++) {       
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
        currentNode.nodeState = NodeStates.SHORTESTPATH;
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    return shortestPath;
}

function getAvailableNeighboursHeap(node, heap) {
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
        neighbour => neighbour.nodeState === NodeStates.UNVISITED
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