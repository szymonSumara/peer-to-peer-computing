import express from 'express'
import { Request, Response } from 'express'
import http from 'http'
import { AddressInfo } from 'net'

export default class ApiProvider{
    private route : express.Express;
    private inc : number;
    constructor(){
        this.inc = 0;
        this.route = express();
        this.route.use(express.static('api/public'))
        this.route.get('/add/:hash', (req: Request, res :Response) => {
            console.log("Get job:" + req.params.hash);
            res.send("Start task: " + req.params.hash);
        });

        this.route.get('/', (req: Request, res :Response) => {
            res.sendFile("index.html");
        });

        this.route.get('/stat', (req: Request, res :Response) => {
            this.inc += 1;
            res.send(
                [
                    {
                        hash:"test1",
                        blockQueue: [2,30,],
                        actualBlocks: [3,4,31],
                        actualSubtaskNumber : [32],
                        nextBlock : this.inc,
                        result : null,
                    },{
                        hash:"test2",
                        blockQueue: [],
                        actualBlocks: [],
                        actualSubtaskNumber : null,
                        nextBlock : null,
                        result : "abc",
                     }
                ]
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