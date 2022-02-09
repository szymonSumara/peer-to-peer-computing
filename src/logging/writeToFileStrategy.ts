import {LoggingStrategy} from "./loggingStrategy";
import fs from 'fs';

export class WriteToFileStrategy implements LoggingStrategy{

    private readonly fileName : string;

    constructor(fileName : string) {
        this.fileName = fileName;

    }

    log(data: string): void {
        fs.appendFile(this.fileName, data + '\n', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
}


