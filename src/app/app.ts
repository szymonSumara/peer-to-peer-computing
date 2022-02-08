import ApiProvider from "../api/apiProvider";
import ConnectionManager from "../communication/communicationManager";
import JobManager from "../task/jobManager";

export default class App{

    private api : ApiProvider;
    private connection : ConnectionManager;
    private readonly jobManager : JobManager;

    constructor(){
        this.connection = ConnectionManager.getInstance();
        this.jobManager = new JobManager();
        this.api = new ApiProvider(this.jobManager);
    }

    start(){
       // this.api.listen(8080);
        this.connection.connect("127.0.0.1" , 53109);
    }
}