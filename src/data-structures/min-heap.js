/***
 * An array implementation of a MinHeap
 * This implementation of MinHeap is meant to be used to store the Node object
 * The Node.distance will be used to compare and sort the nodes in the heap
 */
export default class MinHeap {
    constructor() {
        this.heap = [];
        this.map = new Map();

        this.test();
    }

    getMin() {
        return this.heap[0];
    }

    insert(node) {
        this.heap.push(node);

        let index = this.heap.length - 1;

        while (index > 0) {
            let element = this.heap[index];
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIndex];

            if (parent.distance <= element.distance) break;
            this.heap[index] = parent;
            this.heap[parentIndex] = element;
            index = parentIndex;
        }

        //set node heapIndex in map with it's index as key
        this.map.set(`${node.row}:${node.col}`, index);
    }

    remove() {
        let smallest = this.heap[0];
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
            [this.heap[smallest], this.heap[index]] = [
                this.heap[index],
                this.heap[smallest]
            ];
            this.sinkDown(smallest);
        }
    }

    changeDistance(node, distance) {
        // get node in map and set distance
        var heapIndex = this.map.get(`${node.row}:${node.col}`);
        this.heap[heapIndex].distance = distance;

        // heapify tree
        while (heapIndex > 0 && this.heap[heapIndex].distance <= this.heap[Math.floor((heapIndex - 1) / 2)].distance) {
            // swap the node with it's parent
            const temp = this.heap[heapIndex];
            this.heap[heapIndex] = this.heap[Math.floor((heapIndex - 1) / 2)];
            this.heap[Math.floor((heapIndex - 1) / 2)] = temp;

            // set the index to the parent index
            heapIndex = Math.floor((heapIndex - 1) / 2);
        }
        // console.log(heapIndex)
        // console.log(`parent index: ${Math.floor((heapIndex - 1) / 2)}`)
        // console.log(`parent distance: ${this.heap[Math.floor((heapIndex - 1) / 2)].distance}`)

        // console.log(heapIndex >= 0)
        // console.log(this.heap[heapIndex].distance <= this.heap[Math.floor((heapIndex - 1) / 2)].distance)
        // console.log(this.heap[heapIndex].distance)


    }

    test() {
        const node1 = {
            row: 0,
            col: 0,
            distance: 1
        };
        const node2 = {
            row: 1,
            col: 0,
            distance: 2
        };
        const node3 = {
            row: 2,
            col: 0,
            distance: 8
        };
        const node4 = {
            row: 3,
            col: 0,
            distance: 7
        };
        const node5 = {
            row: 4,
            col: 0,
            distance: 5
        };

        this.insert(node1);
        this.insert(node2);
        this.insert(node3);
        this.insert(node4);
        this.insert(node5);


        this.changeDistance(node5, 4)


        console.log(this.remove());
        console.log(this.remove());
        console.log(this.remove());
        console.log(this.remove());
        console.log(this.remove());

    }
}