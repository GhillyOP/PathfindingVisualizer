/***
 * An array implementation of a MinHeap
 * This implementation of MinHeap is meant to be used to store the Node object
 * The Node.distance will be used to compare and sort the nodes in the heap
 */
export default class MinHeap {
    constructor() {
        this.heap = [];
        this.map = new Map();
    }

    getMin() {
        return this.heap[0];
    }

    getNodeAt(key) {
        const heapIndex = this.map.get(key);
        const node = this.heap[heapIndex];
        return node;
    }

    isHeap() {
        // Start from root and go till the last internal 
        // node 
        for (let i = 0; i <= (this.heap.length - 2) / 2; i++) {
            // If left child is greater, return false 
            if (this.heap[2 * i + 1] > this.heap[i])
                return false;

            // If right child is greater, return false 
            if (2 * i + 2 < this.heap.length && this.heap[2 * i + 2] > this.heap[i])
                return false;
        }
        return true;
    }


    insert(node) {
        this.heap.push(node);
        this.map.set(`${node.row}:${node.col}`, node);

        let index = this.heap.length - 1;

        while (index > 0) {
            let element = this.heap[index];
            let parent = this.heap[Math.floor((index - 1) / 2)];

            if (parent.distance < element.distance) break;


            this.swap(index, Math.floor((index - 1) / 2))
            index = Math.floor((index - 1) / 2);
        }
    }

    remove() {
        let smallest = this.heap[0];
        this.map.delete(`${smallest.row}:${smallest.col}`);
        this.heap[0] = this.heap.pop();
        this.sinkDown(0);
        return smallest;
    }

    sinkDown(index) {
        let left = 2 * index + 1;
        let right = 2 * index + 2;
        let smallest = index;
        const length = this.heap.length;

        // if left child is greater than parent
        if (
            left < length &&
            this.heap[left].distance < this.heap[smallest].distance
        ) {
            smallest = left;
        }
        // if right child is greater than parent
        if (
            right < length &&
            this.heap[right].distance < this.heap[smallest].distance
        ) {
            smallest = right;
        }
        // swap
        if (smallest !== index) {
            this.swap(index, smallest)
            this.sinkDown(smallest);
        }
    }

    changeDistance(node, distance) {
        // get node in map and set distance
        let heapIndex = this.map.get(`${node.row}:${node.col}`);

        this.heap[heapIndex].distance = distance;

        // heapify tree
        while (heapIndex !== 0 && this.heap[heapIndex].distance < this.heap[Math.floor((heapIndex - 1) / 2)].distance) {
            this.swap(heapIndex, Math.floor((heapIndex - 1) / 2))
            heapIndex = Math.floor((heapIndex - 1) / 2);
        }
    }

    setPreviousNode(node, previousNode) {
        let heapIndex = this.map.get(`${node.row}:${node.col}`);
        this.heap[heapIndex].previousNode = previousNode;
    }


    swap(index1, index2){
        const temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;

        this.map.set(`${this.heap[index1].row}:${this.heap[index1].col}`, index1)
        this.map.set(`${this.heap[index2].row}:${this.heap[index2].col}`, index2)
    }
}