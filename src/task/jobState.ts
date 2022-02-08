import WorkPartInformation from "../work/workPartInformation";

export  default class JobState{

    public nextBlock : number;
    public blockInProgress : WorkPartInformation[];
    public blockQueue : number[];

    constructor();
    constructor(nextBlock : number, blockInProgress : WorkPartInformation[], blockQueue : number[]);
    constructor(nextBlock? : number, blockInProgress? : WorkPartInformation[], blockQueue? : number[]) {
        this.nextBlock = nextBlock || 0;
        this.blockInProgress = blockInProgress || [];
        this.blockQueue = blockQueue || [];
    }

    next() : number{
        let blockNumber  =  this.blockQueue.pop();
        if( blockNumber === undefined ){
            blockNumber = this.nextBlock;
            this.nextBlock += 1;
        }
        return blockNumber
    }

    // return true if this.blockInProgress was changed
    noteStart( workInfo : WorkPartInformation) : boolean {

        this.blockQueue = this.blockQueue.filter(
            blockInQueue => blockInQueue !== workInfo.blockNumber
        );

        const indexInBlockInProgress = this.blockInProgress.findIndex(
            work => work.blockNumber === workInfo.blockNumber
        );

        if(indexInBlockInProgress !== -1){
            if(this.blockInProgress[indexInBlockInProgress].startTime > workInfo.startTime){
                this.blockInProgress[indexInBlockInProgress] = workInfo;
                return true;
            }
        }else{
            this.blockInProgress.push(workInfo);
            this.nextBlock = Math.max(this.nextBlock, workInfo.blockNumber + 1);
        }

        return false;
    }

    noteFinish(blockNumber : number) {
        this.blockInProgress = this.blockInProgress.filter(
            workInfoInArr =>  workInfoInArr.blockNumber !== blockNumber
        )
    }

    noteDisconnect( connectId : string ){
        const interruptedWork = this.blockInProgress.find( work => work.processedBy === connectId);
        if(interruptedWork !== undefined){
            this.blockQueue.push(interruptedWork.blockNumber);
            this.blockInProgress = this.blockInProgress.filter(work => work.processedBy !== connectId)
        }
    }
}