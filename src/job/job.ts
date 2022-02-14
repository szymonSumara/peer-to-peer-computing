import {WorkPartInformation} from "../work";
import {ConnectionObserver} from "../communication";
import {Task, JobState, JobCommunication} from "../job";
import {Alphabet} from "../alphabet";
import process from "process";

export class Job implements ConnectionObserver{

    public readonly hash : string;
    private readonly state : JobState;
    public isFinished : boolean = false;
    public result : string = "";
    private communication : JobCommunication;
    private actualTask : Task | undefined;
    private work : WorkPartInformation | undefined ;

    private alphabet : Alphabet;

    constructor(hash : string, communication : JobCommunication );
    constructor(hash : string, communication : JobCommunication, state : JobState );
    constructor(hash : string, communication : JobCommunication, state? : JobState){
        this.state = state || new JobState();
        this.communication = communication;
        this.hash = hash;
        this.alphabet = new Alphabet();
        this.startNewTask();
    }

    public getStat(){
        return {
            hash:this.hash,
            actualBlocks: this.state.blockInProgress.map( work => work.blockNumber ),
            blockQueue: this.state.blockQueue,
            actualSubtaskNumber :   this.work !== undefined ?  this.getWorkRep(this.work.blockNumber) : "",
            nextBlock :  this.getWorkRep(this.state.nextBlock),
            result : this.result,
        }
    }

    private getWorkRep(blockNumber : number){
        if (blockNumber <= 0 ) return `${blockNumber} ( - )`;
        return `${blockNumber} ( ${this.alphabet.letterFromInt(blockNumber - 1)} )`;
    }

    private startNewTask(){
        this.actualTask?.interrupt();
        let blockNumber  =  this.state.next();
        const hrTime = process.hrtime();

        this.work = {
            blockNumber : blockNumber,
            processedBy : "",
            startTime : hrTime[0] * 1000000000 + hrTime[1],
        }

        this.actualTask = new Task(this.hash, blockNumber, this);
        this.state.noteStart(this.work);
        this.communication.propagateStartTask(this.hash, this.work);

    }

    finish(result : string){
        this.result = result;
        this.isFinished = true;
        if(this.work !== undefined) this.work.blockNumber = -1;
        this.state.clear();
        this.actualTask?.interrupt();
    }
    
    handleFindResult(result : string){
        this.communication.propagateFindResult(this.hash, result);
    }


    finishTask(blockNumber : number){
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
        setTimeout( () => this.communication.propagateStartJob(this.hash , this.state),2000);
    }

    notifyRemoveConnection(connectionId: string): void {
        this.state.noteDisconnect(connectionId);
    }
}