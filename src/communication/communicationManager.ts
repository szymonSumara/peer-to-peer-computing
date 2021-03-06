import {createSocket, Socket} from "dgram";
import config from "config";

import { Message, MessageBuilder, MessageType } from '../message'
import {Host, ConnectionObserver, MessageObserver, ActiveConnections} from '../communication'


export class ConnectionManager{

    public readonly id : string;
    private static instance : ConnectionManager;
    private socket : Socket;
    private activeConnections: ActiveConnections;
    private messageBuilder : MessageBuilder;
    private messageObservers : MessageObserver[];

    private constructor(){
        this.messageObservers = [];

        this.id = "Szy-Komp-" + new Date().getTime();
        this.messageBuilder = new MessageBuilder();
        this.messageBuilder
            .setSender(this.id)
            .setType(MessageType.PING);

        this.activeConnections = new ActiveConnections(this.id);
        const port : number = config.get('PORT') || 0;

        this.socket = createSocket('udp4');
        this.socket.on('listening',this.listen);
        this.socket.on('message', this.onMessage);
        this.socket.bind(port, '0.0.0.0');

        setInterval( () => {
            this.ping();
        }, 1000);

    }

    static getInstance = () => {
        if(ConnectionManager.instance == undefined)
            ConnectionManager.instance = new ConnectionManager();
        return ConnectionManager.instance;
    }

    send(message : Message, host : Host){
        const convertedMessage = JSON.stringify(message);
        this.socket.send(
            convertedMessage, 0,
            convertedMessage.length,
            host.port, host.ip);

    }

    broadcast(message : Message ){
        this.activeConnections.getHosts().forEach( (host) => this.send(message, host))
    }

    listen = () => {
        const address = this.socket.address();
        console.log('UDP socket listening on ' + address.address + ':' + address.port);
    }

    ping(){
        this.broadcast(
            this.messageBuilder
                .setOtherHosts(this.activeConnections.getHosts())
                .getMessage()
        )
    }

    connect(ip: string, port: number){

        const message = this.messageBuilder
            .setType(MessageType.PING)
            .setOtherHosts([])
            .getMessage();

        const convertedMessage = JSON.stringify(message);

        this.socket.send(
            convertedMessage, 0,
            convertedMessage.length,
            port, ip);
    }

    onMessage = (message : string, remote : any) => {
        let  parsedMessage : Message = JSON.parse(message);

        const nodeId = parsedMessage.sender;
        const {address, port} = remote;
        this.activeConnections.notifyActivity(new Host(nodeId, address, port));

        if(parsedMessage.data.type == MessageType.PING) {
            console.log('\x1b[36m%s\x1b[0m',`Get ping from ${address}:${port} ${parsedMessage.sender}`)
            this.activeConnections.handlePingMessage(parsedMessage.data);
        }else {
            this.messageObservers.forEach(observer =>
                observer.receiveMessage(parsedMessage)
            )
        }
    }

    subscribeMessage(observer :  MessageObserver){
        this.messageObservers.push(observer);
    }

    subscribeConnection(observer :  ConnectionObserver){
        this.activeConnections.subscribeConnection(observer);
    }

    unsubscribeMessage(observer :  MessageObserver){
        this.messageObservers = this.messageObservers.filter( observerInArray => observerInArray !== observer)
    }

    unsubscribeConnection(observer :  ConnectionObserver){
        this.activeConnections.unsubscribeConnection(observer);
    }
}