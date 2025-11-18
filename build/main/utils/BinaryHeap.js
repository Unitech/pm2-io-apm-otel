"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BinaryHeap {
    _elements;
    constructor(options) {
        options = options || {};
        this._elements = options.elements || [];
        this._score = options.score || this._score;
    }
    add() {
        for (let i = 0; i < arguments.length; i++) {
            const element = arguments[i];
            this._elements.push(element);
            this._bubble(this._elements.length - 1);
        }
    }
    first() {
        return this._elements[0];
    }
    removeFirst() {
        const root = this._elements[0];
        const last = this._elements.pop();
        if (this._elements.length > 0) {
            this._elements[0] = last;
            this._sink(0);
        }
        return root;
    }
    clone() {
        return new BinaryHeap({
            elements: this.toArray(),
            score: this._score
        });
    }
    toSortedArray() {
        const array = [];
        const clone = this.clone();
        while (true) {
            const element = clone.removeFirst();
            if (element === undefined)
                break;
            array.push(element);
        }
        return array;
    }
    toArray() {
        return [].concat(this._elements);
    }
    size() {
        return this._elements.length;
    }
    _bubble(bubbleIndex) {
        const bubbleElement = this._elements[bubbleIndex];
        const bubbleScore = this._score(bubbleElement);
        while (bubbleIndex > 0) {
            const parentIndex = this._parentIndex(bubbleIndex);
            const parentElement = this._elements[parentIndex];
            const parentScore = this._score(parentElement);
            if (bubbleScore <= parentScore)
                break;
            this._elements[parentIndex] = bubbleElement;
            this._elements[bubbleIndex] = parentElement;
            bubbleIndex = parentIndex;
        }
    }
    _sink(sinkIndex) {
        const sinkElement = this._elements[sinkIndex];
        const sinkScore = this._score(sinkElement);
        const length = this._elements.length;
        while (true) {
            let swapIndex;
            let swapScore;
            let swapElement = null;
            const childIndexes = this._childIndexes(sinkIndex);
            for (let i = 0; i < childIndexes.length; i++) {
                const childIndex = childIndexes[i];
                if (childIndex >= length)
                    break;
                const childElement = this._elements[childIndex];
                const childScore = this._score(childElement);
                if (childScore > sinkScore) {
                    if (swapScore === undefined || swapScore < childScore) {
                        swapIndex = childIndex;
                        swapScore = childScore;
                        swapElement = childElement;
                    }
                }
            }
            if (swapIndex === undefined)
                break;
            this._elements[swapIndex] = sinkElement;
            this._elements[sinkIndex] = swapElement;
            sinkIndex = swapIndex;
        }
    }
    _parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    _childIndexes(index) {
        return [
            2 * index + 1,
            2 * index + 2
        ];
    }
    _score(element) {
        return element.valueOf();
    }
}
exports.default = BinaryHeap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmluYXJ5SGVhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9CaW5hcnlIZWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBcUIsVUFBVTtJQUVyQixTQUFTLENBQUE7SUFFakIsWUFBYSxPQUFPO1FBQ2xCLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFBO1FBRXZCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUE7UUFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDNUMsQ0FBQztJQUVELEdBQUc7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUU1QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3pDLENBQUM7SUFDSCxDQUFDO0lBRUQsS0FBSztRQUNILE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUVqQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxD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