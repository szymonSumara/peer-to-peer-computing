import  express from 'express'
import { Request, Response } from 'express'
import http from 'http'
import { AddressInfo } from 'net'
import { JobManager} from "../job";
import cors from 'cors';

export default class ApiProvider{

    private route : express.Express;
    private jobManager : JobManager;

    constructor( jobManager : JobManager){

        this.jobManager = jobManager;
        this.route = express();
        this.route.use(cors());
        this.route.use(express.static('public'))
        this.route.get('/add/:hash', (req: Request, res :Response) => {
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