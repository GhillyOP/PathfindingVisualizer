import NodeStates from './node-states'


export const createGrid = (rowCount, colCount, startIndex, endIndex) => {
    let grid = [];
    for (let i = 0; i < rowCount; i++) {
      let row = [];
  
      for (let j = 0; j < colCount; j++) {
        row.push(createNode(j, i, startIndex, endIndex));
      }
      grid.push(row);
    }
  
    return grid;
  }
  
  export const  createNode = (col, row, startIndex, endIndex) => {
    let isStart = false;
    let isEnd = false;
  
    if (row === startIndex[0] && col === startIndex[1]) isStart = true;
    else if (row === endIndex[0] && col === endIndex[1]) isEnd = true;
  
    return {
      row,
      col,
      isStart: isStart,
      isEnd: isEnd,
      distance: Infinity,
      previousNode: null,
      nodeState: NodeStates.UNVISITED
    };
  }
  
  export const setNodeInGrid = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
  
    let nodeState;
  
    if (node.nodeState === NodeStates.WALL) nodeState = NodeStates.UNVISITED;
    else if (node.nodeState === NodeStates.UNVISITED) nodeState = NodeStates.WALL;
  
    const newNode = {
      ...node,
      nodeState: nodeState
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };