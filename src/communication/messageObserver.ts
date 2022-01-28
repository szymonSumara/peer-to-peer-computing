import Message from "../message/messge";

export default interface MessageObserver{
    reciveMessage(message : Message) : void;
}