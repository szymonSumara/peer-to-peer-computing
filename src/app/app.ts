import ApiProvider from "../api/apiProvider";
import {ConnectionManager} from "../communication";
import {JobManager} from "../job";

import {Logger , MessageLogger, ConnectionLogger , WriteToFileStrategy, WriteToConsoleStrategy} from "../logging";
import {WorkBlock} from "../work";

export default class App{

    private api : ApiProvider;
    private connection : ConnectionManager;
    private readonly jobManager : JobManager;
    private readonly messageLogger : Logger;
    private readonly connectionLogger : Logger;

    constructor(){
        this.connection = ConnectionManager.getInstance();
        this.jobManager = new JobManager();
        this.api = new ApiProvider(this.jobManager);

        this.messageLogger = new MessageLogger(new WriteToConsoleStrategy());
        this.connectionLogger = new ConnectionLogger( new WriteToFileStrategy("connectionLogs.txt"));
    }

    start(){

        this.api.listen(8080);
        this.connection.connect("127.0.0.1" , 3000);
    }
}