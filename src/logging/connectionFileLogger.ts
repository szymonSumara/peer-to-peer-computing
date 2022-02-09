import {Logger} from "./logger";
import {ConnectionObserver} from "../communication";
import {LoggingStrategy} from "./loggingStrategy";
import {FilePrinter} from "./filePrinter";

export class ConnectionFileLogger implements Logger,ConnectionObserver{
    loggingStrategy: LoggingStrategy = new FilePrinter("ConnectionLogs.txt");

    notifyNewConnection(connectionId: string): void {
        this.loggingStrategy.log("New Connection:" + connectionId );
    }

    notifyRemoveConnection(connectionId: string): void {
        this.loggingStrategy.log("Remove Connection: " + connectionId);
    }

}