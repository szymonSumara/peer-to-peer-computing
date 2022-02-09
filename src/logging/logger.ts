import {LoggingStrategy} from "./loggingStrategy";

export abstract class Logger{
    protected loggingStrategy : LoggingStrategy;
    protected loggerLabel : string;


    protected constructor(loggingStrategy : LoggingStrategy, loggerLabel : string) {
        this.loggingStrategy = loggingStrategy;
        this.loggerLabel = loggerLabel;
    }

    log( data : string ){
        this.loggingStrategy.log(`[${this.loggerLabel}][${new Date().getDate()}] ${data} \n`)
    }
}