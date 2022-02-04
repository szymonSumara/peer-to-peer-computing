import WorkPartInformation from "../work/workPartInformation";
import ConnectionObserver from "../communication/connectionObserver";
import Task from "./task";
import MessageBuilder from "../message/messageBuilder";
import ConnectionManager from "../communication/communicationManager";
import JobManager from "./jobManager";
import {MessageType} from "../message/messageType";
import Message from "../message/messge";

export default class Job implements ConnectionObserver{

    private readonly hash : string;
    private nextBlock : number;
    private taskInProgress : WorkPartInformation[];
    private taskQueue : number[];
    private isFinished : boolean = false;
    private result : string = "";

    private actualTask : Task | undefined;
    private work : WorkPartInformation | undefined ;

    private messageBuilder : MessageBuilder;
    private jobManager : JobManager;

    constructor(hash : string, jobManager : JobManager, nextBlock : number , taskInProgress : WorkPartInformation[], taskInQueue : number[]){
        this.jobManager = jobManager;
        this.hash = hash;
        this.nextBlock = nextBlock;
        this.taskInProgress = taskInProgress;//TODO: data cannot be object
        this.taskQueue = taskInQueue;
        this.messageBuilder = new MessageBuilder();
        this.messageBuilder.setHash(hash);
        this.messageBuilder.setSender(ConnectionManager.getInstance().id);

        this.startNewTask();
    }

    public getStat(){
        return {
            hash:this.hash,
            actualBlocks: this.taskInProgress.map( work => work.blockNumber ),
            blockQueue: this.taskQueue,
            actualSubtaskNumber : this.work?.blockNumber,
            nextBlock : this.nextBlock,
            result : this.result,
        }
    }

    private startNewTask(){
        let blockNumber  =  this.taskQueue.pop();

        if( blockNumber === undefined ){
            blockNumber = this.nextBlock;
            this.nextBlock += 1;
        }

        this.work = {
            blockNumber : blockNumber,
            processedBy : "",
            startTime : new Date(),
        }

        this.actualTask = new Task(this.hash, blockNumber, this);

        this.jobManager.forwardMessage(
            this.messageBuilder
                .setType(MessageType.START_TASK)
                .setStartTime(this.work.startTime)
                .setBlockNumber(this.work.blockNumber)
                .getMessage()
        );
    }

    finish(result : string){
        console.log(result + " result")
        this.result = result;
        this.isFinished = true;
        this.actualTask?.interupt();
    }

    finishAndPropagate(result : string){
        this.finish(result);
        this.jobManager.forwardMessage(
            this.messageBuilder
                .setType(MessageType.END_JOB)
                .setResult(result)
                .getMessage()
        )
    }

    finishTask(blockNumber : number){
        this.jobManager.forwardMessage(
            this.messageBuilder
                .setType(MessageType.END_TASK)
                .setBlockNumber(blockNumber)
                .getMessage()
        )
        this.actualTask?.interupt();
        this.startNewTask();
    }

    otherFinishTask(blockNumber : number){
        this.taskInProgress = this.taskInProgress.filter( (work) =>  work.blockNumber !== blockNumber)
    }

    private handleReceiveStartTaskMessage( workPartInformation : WorkPartInformation){

    }

    receiveMessage(message : Message){

        if(this.work === undefined) return;
        console.log("Message type: " + message.data.type);
        if(message.data.type === MessageType.START_TASK){
            message.data.startTime = new Date(message.data.startTime);
            if(message.data.blockNumber === this.work.blockNumber){
                console.log(message.data.startTime);
                if(message.data.startTime < this.work.startTime){
                    this.finishTask(this.work.blockNumber);
                    this.taskInProgress.push({
                        startTime:message.data.startTime ,
                        processedBy: message.sender,
                        blockNumber:message.data.blockNumber
                    })
                }else{
                    this.jobManager.forwardMessage(
                        this.messageBuilder
                            .setType(MessageType.START_TASK)
                            .setNextBlock(this.work.blockNumber)
                            .setStartTime(this.work.startTime)
                            .getMessage()
                    )
                }
            }else{
                const blockNumber = message.data.blockNumber;
                this.taskQueue = this.taskQueue.filter( blockNumberInQueue => blockNumberInQueue !== blockNumber )
                const indexInActualTask = this.taskInProgress.findIndex((work)=> work.blockNumber === blockNumber);

                if(indexInActualTask !== -1){
                    if(this.taskInProgress[indexInActualTask].startTime > message.data.startTime) {
                        this.taskInProgress[indexInActualTask].processedBy = message.sender
                        this.taskInProgress[indexInActualTask].startTime = message.data.startTime;
                    }
                }else{
                    this.taskInProgress.push({
                        processedBy:message.sender,
                        blockNumber:blockNumber,
                        startTime:message.data.startTime,
                    })
                }
            }

            if(message.data.blockNumber >= this.nextBlock){
                this.nextBlock = message.data.blockNumber+1;
            }

        }else if(message.data.type === MessageType.END_TASK){
            this.otherFinishTask(message.data.blockNumber);
        }
    }

    notifyNewConnection(connectionId: string): void {
        this.jobManager.forwardMessage(
            this.messageBuilder
                .setType(MessageType.NEW_JOB)
                .setNextBlock(this.nextBlock)
                .setBlocksInProgress(this.taskInProgress)
                .setBlocksInQueue(this.taskQueue)
                .getMessage())
    }

    notifyRemoveConnection(connectionId: string): void {
        const interruptedWork = this.taskInProgress.find( work => work.processedBy === connectionId);
        if(interruptedWork !== undefined){
            this.taskQueue.push(interruptedWork.blockNumber);
        }
        this.taskInProgress = this.taskInProgress.filter(work => work.processedBy !== connectionId)

    }
}