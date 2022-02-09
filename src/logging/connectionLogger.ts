import {Logger} from "./logger";
import {ConnectionManager, ConnectionObserver} from "../communication";
import {LoggingStrategy} from "./loggingStrategy";

export class ConnectionLogger extends  Logger implements ConnectionObserver{

    constructor(loggingStrategy : LoggingStrategy) {
        super(loggingStrategy, "ConnectionLogger");
        ConnectionManager.getInstance().subscribeConnection(this);
    }

    notifyNewConnection(connectionId: string): void {
        this.loggingStrategy.log("New Connection:" + connectionId );
    }

    notifyRemoveConnection(connectionId: string): void {
        this.loggingStrategy.log("Remove Connection: " + connectionId);
    }

}