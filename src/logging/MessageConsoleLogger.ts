import {Logger} from "./logger";
import {MessageObserver} from "../communication";
import {ConsolePrinter} from "./consolePrinter";
import {LoggingStrategy} from "./loggingStrategy";
import {Message} from "../message";

export class MessageConsoleLogger implements Logger, MessageObserver{

    loggingStrategy: LoggingStrategy = new ConsolePrinter();
    receiveMessage(message: Message): void {
        this.loggingStrategy.log( message.data.type.toString());
    }

}