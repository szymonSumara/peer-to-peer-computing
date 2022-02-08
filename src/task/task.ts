import {Worker} from "worker_threads"
import Job from "./job";

export default class Task{
    private readonly hash : string
    private readonly blockNumber : number;
    private job : Job;
    private worker : Worker;

    constructor(hash : string, blockNumber : number, job : Job){
        this.hash = hash;
        this.blockNumber = blockNumber;
        this.job = job;
        this.worker =  new Worker('./build/task/workerBody.js',{workerData : {hash : this.hash, blockNumber:this.blockNumber}});
        this.worker.on('message', (message) => {
            if(!message.find)
                this.job.finishTask(blockNumber);
            else
                this.job.handleFindResult(message.result);
        });
    }

    run(){
        this.worker = new Worker('./subTask.ts',{workerData : {hash : this.hash, blockNumber:this.blockNumber}})
    }

    interupt(){
        console.log("Interupt")
        this.worker.terminate();
        console.log("Interupt exit")
    }
}