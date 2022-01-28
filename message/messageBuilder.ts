import {MessageType} from "./messageType";


export default class MessageBuilder{
    private type: MessageType;
    private sender: string;
    private hash: string;
    private blockNumber: number;
    private startTime: Date;
    private result: string;
    private otherHosts: Host[];
    private nextBlock: number;
    private blockInProgress: WorkBlock[];
    private blockInQueue: number[];

    private setPing(otherHosts: Host[]){
        this.type = MessageType.PING;
        this.otherHosts = otherHosts;
    }
    private setNewJob(hash: string, nextBlock: number, blocksInProgress: WorkBlock[],otherHosts: Host[]){
        this.type = MessageType.NEW_JOB;
        this.hash = hash;
        this.nextBlock = nextBlock;
        this.blockInProgress = blocksInProgress;
        this.otherHosts = otherHosts;
    }
    private setEndJob(hash: string, result: string){
        this.type = MessageType.END_JOB;
        this.hash = hash;
        this.result= result;
    }
    private setStartTask(hash: string, blockNumber: number, startTime: Date){
        this.type = MessageType.START_TASK;
        this.hash = hash;
        this.blockNumber = blockNumber;
        this.startTime = startTime;
    }
    private setEndTask(hash: string, blockNumber: number){
        this.type = MessageType.END_TASK;
        this.hash = hash;
        this.blockNumber = blockNumber;
    }
    getMessage(){
        switch (this.type){
            case MessageType.PING:
                return {
                    sender: this.sender,
                    Data: {
                        otherHosts: this.otherHosts
                    }
                }
            case MessageType.NEW_JOB:
                return {
                    sender: this.sender,
                    Data: {
                        hash: this.hash,
                        nextBlock: this.nextBlock,
                        blockInProgress: this.blockInProgress,
                        otherHosts: this.otherHosts
                    }
                }
            case MessageType.END_JOB:
                return {
                    sender: this.sender,
                    Data: {
                        hash: this.hash,
                        result: this.result
                    }
                }
            case MessageType.START_TASK:
                return {
                    sender: this.sender,
                    Data: {
                        hash: this.hash,
                        blockNumber: this.blockNumber,
                        startTime: this.startTime
                    }
                }
            case MessageType.END_TASK:
                return {
                    sender: this.sender,
                    Data: {
                        hash: this.hash,
                        blockNumber: this.blockNumber,
                    }
                }
        }
    }
}