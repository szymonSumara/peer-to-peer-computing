import { MessageType } from "./messageType";

export default interface EndTask{
    type : MessageType.END_TASK,
    hash : string,
    blockNumber : number,
}