import ConnectionManager from "../communication/communicationManager";
import JobManager from "./jobManager";
import MessageObserver from "../communication/messageObserver";
import MessageBuilder from "../message/messageBuilder";
import Message from "../message/messge";
import Job from "./job";
import WorkPartInformation from "../work/workPartInformation";
import JobState from "./jobState";
import {MessageType} from "../message/messageType";
import NewJob from "../message/newJob";
import EndTask from "../message/endTask";
import StartTask from "../message/startTask";
import EndJob from "../message/endJob";

export default class TaskCommunication implements MessageObserver{

    private connectionManager : ConnectionManager;
    private messageBuilder : MessageBuilder;
    private jobManager : JobManager;
    private jobs : Map<string, Job>;

    constructor(jobManager : JobManager){

        this.jobManager = jobManager;
        this.jobs = new Map<string, Job>();
        this.connectionManager = ConnectionManager.getInstance();
        this.connectionManager.subscribeMessage(this);
        this.messageBuilder = new MessageBuilder();
        this.messageBuilder.setSender( this.connectionManager.id );

    }

    public startJob(hash : string, state? : JobState ){
        const message = this.messageBuilder
            .setType(MessageType.NEW_JOB)
            .setHash(hash)
            .setNextBlock( state?.nextBlock || 0)
            .setBlocksInProgress(state?.blockInProgress || [])
            .setBlocksInQueue(state?.blockQueue || [])
            .getMessage();

        this.connectionManager.send(message);

    }

    public finishJob(hash : string, result : string){
        const message = this.messageBuilder
            .setType(MessageType.END_JOB)
            .setHash(hash)
            .setResult(result)
            .getMessage();

        this.connectionManager.send(message);
    }

    public finishTask(hash : string,  blockNumber : number){
        const message = this.messageBuilder
            .setType(MessageType.END_TASK)
            .setHash(hash)
            .setBlockNumber(blockNumber)
            .getMessage();

        this.connectionManager.send(message);
    }

    public startTask(hash : string,  workInfo : WorkPartInformation ){
        const message = this.messageBuilder
            .setType(MessageType.START_TASK)
            .setHash(hash)
            .setStartTime(workInfo.startTime)
            .setBlockNumber(workInfo.blockNumber)
            .getMessage();

        this.connectionManager.send(message);
    }

    public findResult(hash : string, result : string){
        this.finishJob(hash,result);
        this.jobManager.finishJob(hash, result);
    }

    public addJobAndSubscribe( newJob : Job){
        this.jobs.set(newJob.hash, newJob);
        this.connectionManager.subscribeConnection(newJob);
    }

    public removeJobAndUnsubscribe(jobToRemove : Job){
        this.jobs.delete(jobToRemove.hash);
        this.connectionManager.unsubscribeConnection(jobToRemove);
    }

    receiveMessage(message: Message): void {
        console.log("reciveMessage");
        switch (message.data.type){
            case MessageType.NEW_JOB:
                this.handleNewJobMessage(message.data);
                break;
            case MessageType.END_JOB:
                this.handleEndJobMessage(message.data);
                break;
            case MessageType.START_TASK:
                this.handleStartTaskMessage(message.sender, message.data);
                break;
            case MessageType.END_TASK:
                this.handleEndTaskMessage(message.data);
                break;
        }
    }

    private handleNewJobMessage(data : NewJob){
        console.log("handleNewJobMessage")
        let {hash, nextBlock, blocksInProgress, blocksInQueue } = data;
        blocksInProgress = blocksInProgress.map( block => {
            block.startTime = new Date(block.startTime);
            return block;
        })
        this.jobManager.addJob(hash, new JobState(nextBlock, blocksInProgress,blocksInQueue))
    }

    private handleEndJobMessage(data : EndJob){
        console.log("handleEndJobMessage")
        let {hash, result } = data;
        this.jobManager.finishJob(hash, result);
    }

    private handleStartTaskMessage(sender: string , data : StartTask){
        console.log("handleStartTaskMessage")
        const job = this.jobs.get(data.hash);
        if(job === undefined) return;
        job.notifyStartTask({
            processedBy:sender,
            blockNumber: data.blockNumber,
            startTime : new Date(data.startTime)
        });
    }

    private handleEndTaskMessage(data : EndTask){
        console.log("handleEndTaskMessage")
        const job = this.jobs.get(data.hash);
        if(job === undefined) return;
        job.notifyEndTask( data.blockNumber);
    }
}