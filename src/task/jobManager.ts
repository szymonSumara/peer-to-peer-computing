import Job from "./job";
import MessageBuilder from "../message/messageBuilder";
import ConnectionManager from "../communication/communicationManager";
import MessageObserver from "../communication/messageObserver";
import Message from "../message/messge";
import {MessageType} from "../message/messageType";
import WorkPartInformation from "../work/workPartInformation";

export default class JobManager implements MessageObserver{

    private jobs : Map<string, Job>;
    private messageBuilder : MessageBuilder;
    private connectionManager : ConnectionManager;

    constructor(){
        this.jobs = new Map<string, Job>();
        this.connectionManager = ConnectionManager.getInstance();
        this.connectionManager.subscribeMessage(this);
        this.messageBuilder = new MessageBuilder();
        this.messageBuilder.setSender(this.connectionManager.id);
    }

    getStat(){
        const stat = new Array();

        this.jobs.forEach(element =>
            stat.push(
                element.getStat()
            ));
        return stat;
    }

    addJob(hash : string , nextBlock : number, taskInProgress : WorkPartInformation[], taskInQueue : number[]) : boolean{
        if(this.jobs.get(hash) === undefined) {
            const job = new Job(hash, this, nextBlock, taskInProgress, taskInQueue)
            this.connectionManager.subscribeConnection(job);
            this.jobs.set(hash, job);

            return true;
        }
       return false;
    }

    addJobAndPropagate( hash : string) {
        console.log(hash)
        if (this.addJob(hash, 0, [], []))
            this.connectionManager.send(
                this.messageBuilder
                    .setHash(hash)
                    .setType(MessageType.NEW_JOB)
                    .getMessage()
            )
    }

    forwardMessage(message : Message){
        //TODO: unsubscribe
        this.connectionManager.send(message);
    }


    finishJob(hash : string, result :string){

        const job = this.jobs.get(hash);

        if(job !== undefined) {
            this.connectionManager.unsubscribeConnection(job);
            job.finish(result);
        }
    }


    receiveMessage(message:Message){
        if(message.data.type === MessageType.NEW_JOB){
            this.addJob(message.data.hash, message.data.nextBlock, message.data.blocksInProgress, message.data.blocksInQueue);
        }else if(message.data.type === MessageType.END_JOB){
            this.finishJob(message.data.hash, message.data.result);
        }else{
            if( message.data.type === MessageType.END_TASK || message.data.type === MessageType.START_TASK ){
                console.log("Message Type" + message.data.type);
                const job = this.jobs.get(message.data.hash);
                if(job !== undefined) job.receiveMessage(message);
            }
        }
    }
}