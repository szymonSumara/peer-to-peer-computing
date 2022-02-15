import {Host, ConnectionObserver} from "../communication";
import {Ping} from "../message";

export  class ActiveConnections{

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
        if(host !== undefined) {
            host.updateLastActivityTime(new Date(date));
        }else{
            this.activeHost.push( new Host(id, ip, port, new Date()))
            this.connectionObservers.forEach(observer => observer.notifyNewConnection(id))
        }

    }

    handlePingMessage( data : Ping ){
        data.othersHosts.forEach( hostData => {
            const hostInActive = this.activeHost.find(h => h.id === hostData.id);
            if(hostInActive === undefined) this.notifyActivity(hostData)
        });
    }

    private removeDisconnectedHosts(){
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
        const observerInArr = this.connectionObservers.find(o => o === observer);
        if(observerInArr === undefined) this.connectionObservers.push(observer);
    }

    unsubscribeConnection(observer :  ConnectionObserver){
        this.connectionObservers = this.connectionObservers.filter( observerInArray => observerInArray !== observer);
    }
}