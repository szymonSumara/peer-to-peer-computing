import Message from "../message/messge";

export default interface MessageObserver{
    receiveMessage(message : Message) : void;
}