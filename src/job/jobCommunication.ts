import {ConnectionManager, MessageObserver} from "../communication";
import {WorkPartInformation} from "../work";
import {Job, JobManager, JobState} from '../job';
import {Message, MessageType, MessageBuilder, NewJob, EndJob, EndTask, StartTask} from '../message';
import {EventLogger} from "../logging/eventLogger";
import {WriteToFileStrategy} from "../logging";


export class JobCommunication implements MessageObserver{

    private connectionManager : ConnectionManager;
    private messageBuilder : MessageBuilder;
    private jobManager : JobManager;
    private jobs : Map<string, Job>;
    private logger : EventLogger;

    constructor(jobManager : JobManager){
        this.jobManager = jobManager;
        this.jobs = new Map<string, Job>();
        this.connectionManager = ConnectionManager.getInstance();
        this.connectionManager.subscribeMessage(this);
        this.messageBuilder = new MessageBuilder();
        this.messageBuilder.setSender( this.connectionManager.id );
        this.logger = new EventLogger(new WriteToFileStrategy("events.txt"))
    }

    public propagateStartJob(hash : string, state? : JobState ){
        const message = this.messageBuilder
            .setType(MessageType.NEW_JOB)
            .setHash(hash)
            .setNextBlock( state?.nextBlock || 0)
            .setBlocksInProgress(state?.blockInProgress || [])
            .setBlocksInQueue(state?.blockQueue || [])
            .getMessage();
        this.logger.thisNewJob(hash);
        this.connectionManager.broadcast(message);

    }

    public propagateFinishJob(hash : string, result : string){
        const message = this.messageBuilder
            .setType(MessageType.END_JOB)
            .setHash(hash)
            .setResult(result)
            .getMessage();
        this.logger.thisEndJob(result, hash);
        this.connectionManager.broadcast(message);
    }

    public propagateFinishTask(hash : string, blockNumber : number){
        const message = this.messageBuilder
            .setType(MessageType.END_TASK)
            .setHash(hash)
            .setBlockNumber(blockNumber)
            .getMessage();
        this.logger.thisEndTask(blockNumber, hash);
        this.connectionManager.broadcast(message);
    }

    public propagateStartTask(hash : string, workInfo : WorkPartInformation ){
        const message = this.messageBuilder
            .setType(MessageType.START_TASK)
            .setHash(hash)
            .setStartTime(workInfo.startTime)
            .setBlockNumber(workInfo.blockNumber)
            .getMessage();
        this.logger.thisStartTask(workInfo.blockNumber, hash);
        this.connectionManager.broadcast(message);
    }

    public propagateFindResult(hash : string, result : string){
        this.propagateFinishJob(hash,result);
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
        switch (message.data.type){
            case MessageType.NEW_JOB:
                this.handleNewJobMessage(message.data);
                this.logger.otherNewJob(message.sender, message.data.hash);
                break;
            case MessageType.END_JOB:
                this.handleEndJobMessage(message.data);
                this.logger.otherEndJob(message.sender, message.data.result, message.data.hash);
                break;
            case MessageType.START_TASK:
                this.handleStartTaskMessage(message.sender, message.data);
                this.logger.otherStartTask(message.sender, message.data.blockNumber, message.data.hash);
                break;
            case MessageType.END_TASK:
                this.handleEndTaskMessage(message.data);
                this.logger.otherEndTask(message.sender, message.data.blockNumber, message.data.hash);
                break;
        }
    }

    private handleNewJobMessage(data : NewJob){
        let {hash, nextBlock, blocksInProgress, blocksInQueue } = data;
        blocksInProgress = blocksInProgress.map( block => {
            block.startTime = new Date(block.startTime);
            return block;
        })
        this.jobManager.addJob(hash, new JobState(nextBlock, blocksInProgress,blocksInQueue))
    }

    private handleEndJobMessage(data : EndJob){
        let {hash, result } = data;
        this.jobManager.finishJob(hash, result);
    }

    private handleStartTaskMessage(sender: string , data : StartTask){
        const job = this.jobs.get(data.hash);
        if(job === undefined) return;
        job.notifyStartTask({
            processedBy:sender,
            blockNumber: data.blockNumber,
            startTime : new Date(data.startTime)
        });
    }

    private handleEndTaskMessage(data : EndTask){
        const job = this.jobs.get(data.hash);
        if(job === undefined) return;
        job.notifyEndTask( data.blockNumber);
    }
}