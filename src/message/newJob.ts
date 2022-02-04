import { MessageType } from "./messageType";
import WorkPartInformation from "../work/workPartInformation";
export default interface NewJob{
    type : MessageType.NEW_JOB,
    hash : string,
    nextBlock : number,
    blocksInProgress : WorkPartInformation[],
    blocksInQueue : number[],

}