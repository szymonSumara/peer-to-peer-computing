import { MessageType } from "../index";
import {Host} from "../../communication";

export interface Ping{
    type : MessageType.PING,
    othersHosts : Host[];
}