export default class Host{

    public id : string;
    public ip : string;
    public port : number;
    public date : Date;
    private static readonly secondsToRemove: number = 5;

    constructor(id : string, ip : string , port : number, date : Date);
    constructor( id : string, ip : string , port : number);

    constructor( ...params: any[]) {
        this.id = params[0];
        this.ip = params[1];
        this.port = params[2];
        if(params[3] !== undefined) this.date = new Date(params[3])
        else this.date = new Date();
    }

    public updateLastActivityTime(date : Date){
        if(this.date < date) this.date = date;
    }

    public isAlive() : boolean {
        const timeDiff = new Date().getTime() - this.date.getTime();
        return timeDiff < Host.secondsToRemove*1000;
    }

}