import {Logger} from "./logger";
import {LoggingStrategy} from "./loggingStrategy";

export class EventLogger extends Logger {

    constructor( loggingStrategy : LoggingStrategy) {
        super(loggingStrategy, "EventLogger");
    }
    thisStartTask(blockNumber: number, hash: string){
        super.log("Our node started block " + blockNumber + " for hash " + hash);
    }
    thisEndTask(blockNumber: number, hash: string){
        super.log("Our node finished block " + blockNumber + " for hash " + hash);
    }
    thisNewJob(hash: string){
        super.log("Our node started new job for hash " + hash);
    }
    thisEndJob(result: string ,hash: string){
        super.log("Our node finished job for hash " + hash + " with result: " +  result);
    }
    otherStartTask(sender: string ,blockNumber: number, hash: string){
        super.log("Node" + sender  + " started block " + blockNumber + " for hash " + hash);
    }
    otherEndTask(sender: string , blockNumber: number, hash: string){
        super.log("Node" + sender  + " finished block " + blockNumber + " for hash " + hash);
    }
    otherNewJob(sender: string ,hash: string){
        super.log("Node" + sender  + " started job for hash " + hash);
    }
    otherEndJob(sender: string ,result: string, hash: string){
        super.log("Node" + sender  + " finished job for hash " + hash + " with result: " + result);
    }
}