import {LoggingStrategy} from "./loggingStrategy";

export class ConsolePrinter implements LoggingStrategy{
    log(data: string): void {
        console.log(data);
    }
}