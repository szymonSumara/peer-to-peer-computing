import {Ping, EndJob, NewJob , EndTask , StartTask , Message , MessageType} from "../message";
import {WorkPartInformation} from "../work";
import {Host} from "../communication";

export class MessageBuilder{

    private type: MessageType | undefined;
    private sender: string  | undefined;
    private hash: string  | undefined;
    private blockNumber: number  | undefined;
    private startTime: number  | undefined;
    private result: string  | undefined;
    private otherHosts: Host[]  | undefined;
    private nextBlock: number  | undefined;
    private blocksInProgress: WorkPartInformation[]  | undefined;
    private blockInQueue: number[] | undefined;

    constructor() {
        this.blockInQueue = [];
        this.blocksInProgress = [];
        this.nextBlock = 0;
    }

    setType(type: MessageType){
        this.type = type;
        return this;
    }

    setSender(sender: string){
        this.sender = sender;
        return this;
    }

    setHash(hash: string){
        this.hash = hash;
        return this;
    }

    setOtherHosts(otherHosts: Host[]){
        this.otherHosts = otherHosts;
        return this;
    }

    setBlockNumber(blockNumber: number){
        this.blockNumber = blockNumber;
        return this;
    }

    setStartTime(startTime: number){
        this.startTime = startTime;
        return this;
    }

    setResult(result: string){
        this.result = result;
        return this;
    }

    setNextBlock(nextBlock: number){
        this.nextBlock = nextBlock;
        return this;
    }

    setBlocksInProgress(blocksInProgress: WorkPartInformation[]){
        this.blocksInProgress = blocksInProgress;
        return this;
    }

    setBlocksInQueue(blocksInQueue: number[]){
        this.blockInQueue = blocksInQueue;
        return this;
    }

    getMessage() : Message {
        if(this.type === undefined)   throw new ReferenceError();
        if(this.sender === undefined) throw new ReferenceError();
        
        let data : Ping | NewJob | EndJob | StartTask | EndTask;
        
        
        switch (this.type){
            case MessageType.PING:
               data =  this.createPing();
               break;
            case MessageType.NEW_JOB:
                data = this.createNewJob();
                break;
            case MessageType.END_JOB:
                data = this.createEndJob();
                break;
            case MessageType.START_TASK:
                data = this.createStartTask();
                break;
            case MessageType.END_TASK:
                data = this.createEndTask();
                break;
            default:
                throw new Error();
        }
        
        return {
            sender : this.sender,
            data : data
        }
    }

    private createPing() : Ping{
        if(this.otherHosts === undefined) throw new ReferenceError();
        
        return {
            type : MessageType.PING,
            othersHosts: this.otherHosts
        }
    }

    private createNewJob() : NewJob{
        
        if(this.hash === undefined) throw new ReferenceError();
        if(this.nextBlock === undefined) throw new ReferenceError();
        if(this.blocksInProgress === undefined) throw new ReferenceError();
        if(this.blockInQueue === undefined) throw new ReferenceError();

        return {
            type: MessageType.NEW_JOB,
            hash: this.hash,
            nextBlock: this.nextBlock,
            blocksInProgress: this.blocksInProgress,
            blocksInQueue: this.blockInQueue,
        }
    }

    private createEndJob() : EndJob{

        if(this.hash === undefined) throw new ReferenceError();
        if(this.result === undefined) throw new ReferenceError();

        return {
            type: MessageType.END_JOB,
            hash: this.hash,
            result: this.result
        }
    }

    private createStartTask() : StartTask{

        if(this.hash === undefined) throw new ReferenceError();
        if(this.blockNumber === undefined) throw new ReferenceError();
        if(this.startTime === undefined) throw new ReferenceError();

        return {
            type : MessageType.START_TASK,
            hash: this.hash,
            blockNumber: this.blockNumber,
            startTime: this.startTime
        }
    }

    private createEndTask() : EndTask{

        if(this.hash === undefined) throw new ReferenceError();
        if(this.blockNumber === undefined) throw new ReferenceError();

        return {
            type: MessageType.END_TASK,
            hash: this.hash,
            blockNumber: this.blockNumber,
        }
    }
}