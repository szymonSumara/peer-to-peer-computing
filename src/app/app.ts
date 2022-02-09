import ApiProvider from "../api/apiProvider";
import {ConnectionManager} from "../communication";
import {JobManager} from "../job";
import {Logger} from "../logging/logger";
import {MessageConsoleLogger} from "../logging/MessageConsoleLogger";
import {ConnectionFileLogger} from "../logging/connectionFileLogger";

export default class App{

    private api : ApiProvider;
    private connection : ConnectionManager;
    private readonly jobManager : JobManager;
    private readonly messageLogger : MessageConsoleLogger;
    private readonly connectionFileLogger : ConnectionFileLogger;

    constructor(){
        this.connection = ConnectionManager.getInstance();
        this.jobManager = new JobManager();
        this.api = new ApiProvider(this.jobManager);

        this.messageLogger = new MessageConsoleLogger();
        this.connection.subscribeMessage(this.messageLogger);

        this.connectionFileLogger = new ConnectionFileLogger();
        this.connection.subscribeConnection(this.connectionFileLogger)
    }

    start(){
        //this.api.listen(8080);
        this.connection.connect("0.0.0.0" , 43863);
    }
}