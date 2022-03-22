import { MessageType } from "../index";

export interface StartTask{
    type : MessageType.START_TASK,
    hash : string,
    startTime : number,
    blockNumber : number,
}