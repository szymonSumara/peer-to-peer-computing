import {LoggingStrategy} from "./loggingStrategy";

export abstract class Logger{
    protected super : LoggingStrategy;
    protected loggerLabel : string;


    protected constructor(loggingStrategy : LoggingStrategy, loggerLabel : string) {
        this.super = loggingStrategy;
        this.loggerLabel = loggerLabel;
    }

    log( data : string ){
        const d = new Date();
        this.super.log(`[${this.loggerLabel}][${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}]  ${data}`)
    }
}