import {Logger} from "./logger";
import {ConnectionManager, MessageObserver} from "../communication";
import {LoggingStrategy} from "./loggingStrategy";
import {Message} from "../message";

export class MessageLogger extends Logger implements  MessageObserver{

    constructor( loggingStrategy : LoggingStrategy) {
        super(loggingStrategy, "MessageLogger");
        ConnectionManager.getInstance().subscribeMessage(this);

    }
    receiveMessage(message: Message): void {
        this.log(`Get message with type ${message.data.type.toString()}`);
    }
}
