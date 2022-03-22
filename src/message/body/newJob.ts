import { MessageType } from "../index";
import {WorkPartInformation} from "../../work";

export interface NewJob{
    type : MessageType.NEW_JOB,
    hash : string,
    nextBlock : number,
    blocksInProgress : WorkPartInformation[],
    blocksInQueue : number[],
}