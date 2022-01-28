import {createSocket, Socket} from "dgram";
import Host from "./host";

import ConnectionObserver from "./connectionObserver";
import MessageObserver from "./messageObserver";
import Message from "../message/messge";
import MessageBuilder from "../message/messageBuilder";
import {MessageType} from "../message/messageType";
import config from "config";

export default class ConnectionManager{

    public readonly id : string;
    private others : Host[];
    private pingIntervalHandler: NodeJS.Timer;
    private removeDisconnectedHostIntervalHandler: NodeJS.Timer;
    private static instance : ConnectionManager;
    private messageBuilder : MessageBuilder;

    private connectionObservers : ConnectionObserver[];
    private messageObservers : MessageObserver[];

    private socket : Socket;

    private constructor(){
        this.messageObservers = [];
        this.connectionObservers = [];

        this.id = "ID-" + new Date().getTime();
        this.messageBuilder = new MessageBuilder();
        this.messageBuilder
            .setSender(this.id)
            .setType(MessageType.PING);

        this.others = new Array<Host>();
        const port : number = config.get('PORT') || 0;

        this.socket = createSocket('udp4');
        this.socket.on('listening',this.listen);
        this.socket.on('message', this.onMessage);
        this.socket.bind(port, '0.0.0.0');

        this.pingIntervalHandler = setInterval( () => {
            this.ping();
        }, 500);

        this.removeDisconnectedHostIntervalHandler = setInterval( () => {
            this.removeDisconnectedHosts()
        }, 2000);
    }

    static getInstance = () => {
        if(ConnectionManager.instance == undefined)
            ConnectionManager.instance = new ConnectionManager();
        return ConnectionManager.instance;
    }

    send = (message : Message ) => {
        const convertedMessage = JSON.stringify(message);
        this.others.forEach( (host) => {
            this.socket.send(
                convertedMessage, 0,
                convertedMessage.length,
                host.port, host.ip);
        })
    }

    listen = () => {
        const address = this.socket.address();
        console.log('UDP socket listening on ' + address.address + ':' + address.port);
    }

    ping = () => {
        this.send(
            this.messageBuilder
                .setOtherHosts(this.others)
                .getMessage()
        )
    }

    removeDisconnectedHosts(){
        this.others = this.others.filter( host => {
            const isAlive : boolean = host.isAlive();

            if(!isAlive){
                console.log('Host dead')
                this.connectionObservers.forEach((observer) =>{
                    observer.notifyRemoveConnection(host.id);
                })
            }

            return isAlive
        });
    }

    connect(ip: string, port: number){

        const message = {
            sender:this.id,
            data: {type: MessageType.PING, othersHosts:this.others },
        }
        const convertedMessage = JSON.stringify(message);

        this.socket.send(
            convertedMessage, 0,
            convertedMessage.length,
            port, ip);
    }

    updateSeder = (updatedHost : Host) => {
        if(updatedHost.id === this.id) return;
        const index = this.others.findIndex((host) => host.id == updatedHost.id)

        if( index < 0 )
            this.others.push(new Host(updatedHost.id, updatedHost.ip, updatedHost.port, updatedHost.date));
        else
            this.others[index].updateLastActivityTime(updatedHost.date);
    }

    onMessage = (message : string, remote : any) => {

        let  parsedMessage : Message = JSON.parse(message);

        const nodeId = parsedMessage.sender;
        const {address, port} = remote;

        this.updateSeder(new Host(nodeId,address,port));

        if(parsedMessage.data.type == MessageType.PING) {
            console.log(`Get ping from ${address}:${port}`)
            parsedMessage.data.othersHosts.forEach(otherHost =>
                this.updateSeder(otherHost)
            )
        }else
            this.messageObservers.forEach( observer  =>
                observer.reciveMessage(parsedMessage)
            )

    }

    subscribeMessage(observer :  MessageObserver){
        this.messageObservers.push(observer);
    }

    subscribeConnection(observer :  ConnectionObserver){
        this.connectionObservers.push(observer);
    }

    unsubscribeMessage(observer :  MessageObserver){
        this.messageObservers = this.messageObservers.filter( observerInArray => observerInArray !== observer)
    }

    unsubscribeConnection(observer :  ConnectionObserver){
        this.connectionObservers =  this.connectionObservers.filter( observerInArray => observerInArray !== observer);
    }
}