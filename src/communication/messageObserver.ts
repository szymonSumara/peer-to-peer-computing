import { Message } from "../message";

export interface MessageObserver{
    receiveMessage(message : Message) : void;
}