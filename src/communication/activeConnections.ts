import Host from "./host";
import Ping from "../message/ping";
import ConnectionObserver from "./connectionObserver";

export default class ActiveConnections{

    private blackList : Map<string, Date>;
    private activeHost : Host[];
    private connectionObservers : ConnectionObserver[];
    private static readonly secondsToRemoveFromBlackList = 10;
    private readonly ignore : string;

    constructor(ignore : string) {
        this.ignore = ignore;
        this.blackList = new Map<string, Date>();
        this.blackList.set("test",new Date());
        this.activeHost = [];
        this.connectionObservers = [];

        setInterval( () => this.clearBlackList(), 1000);
        setInterval( () => this.removeDisconnectedHosts(), 1000);
    }

    notifyActivity( hostData : Host){
        const {id, ip, port, date } = hostData;
        if( this.ignore === id) return;
        if( this.blackList.get(id) !== undefined) return;

        const host  = this.activeHost.find( host => host.id === id);
        if(host !== undefined)
            host.updateLastActivityTime(new Date(date));
        else{
            this.activeHost.push( new Host(id, ip, port, new Date(date)))
            this.connectionObservers.forEach(observer => observer.notifyNewConnection(id))
        }

    }

    handlePingMessage( data : Ping ){
        data.othersHosts.forEach( hostData => this.notifyActivity(hostData));
    }

    private removeDisconnectedHosts(){
        console.log("Active connections : " + this.activeHost.length);
        this.activeHost.forEach( (host) => {
            if(!host.isAlive()){
                this.blackList.set(host.id, new Date());
                host.canBeRemove = true;
                this.connectionObservers.forEach(observer => observer.notifyRemoveConnection(host.id))
            }
        });
        this.activeHost = this.activeHost.filter( (host) => !host.canBeRemove);
    }

    private clearBlackList(){
        console.log(this.blackList);
        for (const key of this.blackList.keys() ) {
            const date = this.blackList.get(key);
            if(date === undefined) return;
            if(date.getTime() + ActiveConnections.secondsToRemoveFromBlackList * 1000 < new Date().getTime())
                this.blackList.delete(key);
        }
    }

    getHosts(){
        return this.activeHost;
    }

    subscribeConnection(observer :  ConnectionObserver){
        this.connectionObservers.push(observer);
    }

    unsubscribeConnection(observer :  ConnectionObserver){
        this.connectionObservers = this.connectionObservers.filter( observerInArray => observerInArray !== observer);
    }
}