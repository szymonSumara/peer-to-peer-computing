import { MessageType } from "./messageType";

export default interface EndJob{
    type: MessageType.END_JOB,
    hash : string,
    result : string,
}