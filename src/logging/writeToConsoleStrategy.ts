import {LoggingStrategy} from "./loggingStrategy";

export class WriteToConsoleStrategy implements LoggingStrategy{
    log(data: string): void {
        console.log(data);
    }
}