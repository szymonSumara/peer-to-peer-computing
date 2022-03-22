import {Logger} from "./logger";
import {ConnectionManager, ConnectionObserver} from "../communication";
import {LoggingStrategy} from "./loggingStrategy";

export class ConnectionLogger extends  Logger implements ConnectionObserver{

    private activeConnectionNumber : number = 0;

    constructor(loggingStrategy : LoggingStrategy) {
        super(loggingStrategy, "ConnectionLogger");
        ConnectionManager.getInstance().subscribeConnection(this);
    }

    notifyNewConnection(connectionId: string): void {
        this.activeConnectionNumber += 1;
        this.log("New Connection: " + connectionId );
        this.log("Connection number: " + this.activeConnectionNumber );

    }

    notifyRemoveConnection(connectionId: string): void {
        this.activeConnectionNumber -= 1;
        this.log("Remove Connection: " + connectionId);
        this.log("Connection number: " + this.activeConnectionNumber );
    }

}