import { MessageType } from "./messageType";
import Work from "../work/work";
export default interface NewJob{
    type : MessageType.NEW_JOB,
    hash : string,
    nextBlock : number,
    blocksInProgress : Work[],
    blocksInQueue : number[],

}