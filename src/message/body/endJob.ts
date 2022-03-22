import { MessageType } from "../index";

export interface EndJob{
    type: MessageType.END_JOB,
    hash : string,
    result : string,
}