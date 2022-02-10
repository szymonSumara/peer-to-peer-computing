import {LoggingStrategy} from "./loggingStrategy";

export abstract class Logger{
    protected loggingStrategy : LoggingStrategy;
    protected loggerLabel : string;


    protected constructor(loggingStrategy : LoggingStrategy, loggerLabel : string) {
        this.loggingStrategy = loggingStrategy;
        this.loggerLabel = loggerLabel;
    }

    log( data : string ){
        const d = new Date();
        this.loggingStrategy.log(`[${this.loggerLabel}][${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}]  ${data}`)
    }
}