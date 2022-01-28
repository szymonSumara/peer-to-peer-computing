import { MessageType } from "./messageType";

export default interface StartTask{
    type : MessageType.START_TASK,
    hash : string,
    startTime : Date,
    blockNumber : number,
}