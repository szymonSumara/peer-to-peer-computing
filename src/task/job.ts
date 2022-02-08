import WorkPartInformation from "../work/workPartInformation";
import ConnectionObserver from "../communication/connectionObserver";
import Task from "./task";
import JobState from "./jobState";
import TaskCommunication from "./taskCommunication";

export default class Job implements ConnectionObserver{

    public readonly hash : string;
    private readonly state : JobState;
    private isFinished : boolean = false;
    private result : string = "";
    private communication : TaskCommunication;
    private actualTask : Task | undefined;
    private work : WorkPartInformation | undefined ;

    constructor(hash : string, communication : TaskCommunication );
    constructor(hash : string, communication : TaskCommunication, state : JobState );
    constructor(hash : string, communication : TaskCommunication, state? : JobState){
        this.state = state || new JobState();
        this.communication = communication;
        this.hash = hash;
        this.startNewTask();
    }

    public getStat(){
        return {
            hash:this.hash,
            actualBlocks: this.state.blockInProgress.map( work => work.blockNumber ),
            blockQueue: this.state.blockQueue,
            actualSubtaskNumber : this.work?.blockNumber,
            nextBlock : this.state.nextBlock,
            result : this.result,
        }
    }

    private startNewTask(){
        let blockNumber  =  this.state.next();

        this.work = {
            blockNumber : blockNumber,
            processedBy : "",
            startTime : new Date(),
        }

        this.actualTask = new Task(this.hash, blockNumber, this);
        this.communication.startTask(this.hash, this.work);
        this.state.noteStart(this.work);
    }

    finish(result : string){
        console.log(result + " result")
        this.result = result;
        this.isFinished = true;
        this.actualTask?.interupt();
    }
    
    handleFindResult(result : string){
        this.communication.findResult(this.hash, result);
    }


    finishTask(blockNumber : number){
        this.communication.finishTask(this.hash, blockNumber);
        this.state.noteFinish(blockNumber);
        this.actualTask?.interupt();
        this.startNewTask();
    }
    
    notifyStartTask( workInfo : WorkPartInformation){
        const noteResult = this.state.noteStart(workInfo);
        if(this.work === undefined) return;
        if(workInfo.blockNumber === this.work.blockNumber)
            if(noteResult)
                this.startNewTask();
            else
                this.communication.startTask(this.hash, this.work);
    }
    
    notifyEndTask(blockNumber : number){
        this.state.noteFinish(blockNumber);
    }

    notifyNewConnection(connectionId: string): void {
        this.communication.startJob(this.hash , this.state);
    }

    notifyRemoveConnection(connectionId: string): void {
        this.state.noteDisconnect(connectionId);
    }
}