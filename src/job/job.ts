import {WorkPartInformation} from "../work";
import {ConnectionObserver} from "../communication";
import {Task, JobState, JobCommunication} from "../job";

export class Job implements ConnectionObserver{

    public readonly hash : string;
    private readonly state : JobState;
    public isFinished : boolean = false;
    public result : string = "";
    private communication : JobCommunication;
    private actualTask : Task | undefined;
    private work : WorkPartInformation | undefined ;

    constructor(hash : string, communication : JobCommunication );
    constructor(hash : string, communication : JobCommunication, state : JobState );
    constructor(hash : string, communication : JobCommunication, state? : JobState){
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
        this.actualTask?.interupt();
        let blockNumber  =  this.state.next();

        this.work = {
            blockNumber : blockNumber,
            processedBy : "",
            startTime : new Date(),
        }

        this.actualTask = new Task(this.hash, blockNumber, this);
        this.state.noteStart(this.work);
        this.communication.propagateStartTask(this.hash, this.work);

    }

    finish(result : string){
        console.log(result + " result")
        this.result = result;
        this.isFinished = true;
        this.state.clear();
        this.actualTask?.interupt();
    }
    
    handleFindResult(result : string){
        this.communication.propagateFindResult(this.hash, result);
    }


    finishTask(blockNumber : number){
        console.log("Finish block number : ", blockNumber);
        this.communication.propagateFinishTask(this.hash, blockNumber);
        this.state.noteFinish(blockNumber);
        this.startNewTask();
    }
    
    notifyStartTask( workInfo : WorkPartInformation){
        const noteResult = this.state.noteStart(workInfo);
        if(this.work === undefined) return;
        if(workInfo.blockNumber === this.work.blockNumber)
            if(noteResult)
                this.startNewTask();
            else
                this.communication.propagateStartTask(this.hash, this.work);
    }
    
    notifyEndTask(blockNumber : number){
        this.state.noteFinish(blockNumber);
    }

    notifyNewConnection(connectionId: string): void {
        this.communication.propagateStartJob(this.hash , this.state);
    }

    notifyRemoveConnection(connectionId: string): void {
        this.state.noteDisconnect(connectionId);
    }
}