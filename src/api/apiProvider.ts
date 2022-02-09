import  express from 'express'
import { Request, Response } from 'express'
import http from 'http'
import { AddressInfo } from 'net'
import { JobManager} from "../job";

export default class ApiProvider{
    private route : express.Express;
    private inc : number;
    private jobManager : JobManager;
    constructor( jobManager : JobManager){
        this.jobManager = jobManager;
        this.inc = 0;
        this.route = express();
        this.route.use(express.static('public'))
        this.route.get('/add/:hash', (req: Request, res :Response) => {
            console.log("Get job:" + req.params.hash);
            this.jobManager.addJobAndPropagate(req.params.hash);
            res.send("Start job: " + req.params.hash);
        });

        this.route.get('/', (req: Request, res :Response) => {
            res.sendFile("index.html");
        });

        this.route.get('/stat', (req: Request, res :Response) => {
            res.send(
                this.jobManager.getStat()
            );
        })

    }


    listen(port : number){
           const server : http.Server  = this.route.listen(port, () => {
               const { port } = server.address() as AddressInfo
            console.log(`Start listen on http://localhost:${port}`);
        })
    }


}