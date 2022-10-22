
const Queue = class{
    constructor(queue, maxConcurrent, onDone){
        this.queue = queue;
        this.realQueue = [];
        this.max = maxConcurrent;
        this.onDone = onDone || (() => {});
        this.add();
    }
    add(){
        if(this.realQueue.length < this.max){
            if(this.queue.length){
                const promise = this.queue.shift()().then(() => {
                    const index = this.realQueue.indexOf(promise);
                    if (index > -1) {
                        this.realQueue.splice(index, 1);
                        this.add();
                        if (this.realQueue.length === 0 && this.queue.length === 0) {
                            return this._onDone();
                        }
                    } else {
                        console.error("Could not find elem in queue! " + promise);
                    }
                });
                this.realQueue.push(promise);
                this.add();
            }
        }
    }

    awaitDone(){
        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
        return this.promise;
    }

    _onDone(){
        this.resolve && this.resolve();
        this.onDone();
    }
};

export default Queue;
