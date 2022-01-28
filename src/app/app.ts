import ApiProvider from "../api/apiProvider";
import ConnectionManager from "../communication/communicationManager";

export default class App{

    private api : ApiProvider;
    private connection : ConnectionManager;

    constructor(){
        this.connection = ConnectionManager.getInstance();
        this.api = new ApiProvider();
    }

    start(){
        this.api.listen(8080);
        this.connection.connect("127.0.0.1" , 56537);
    }
}