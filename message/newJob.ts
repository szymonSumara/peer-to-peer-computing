import { MessageType } from "./messageType";

export default interface NewJob{
    type : MessageType.NEW_JOB,
    hash : string,
    nextBlock : number,
    blocksInProgress : WorkBlock[],
    blocksInQueue : number[],

}