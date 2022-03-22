import { MessageType } from "../index";

export interface EndTask{
    type : MessageType.END_TASK,
    hash : string,
    blockNumber : number,
}