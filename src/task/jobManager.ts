import Job from "./job";
import TaskCommunication from "./taskCommunication";
import JobState from "./jobState";


export default class JobManager{

    private jobs : Map<string, Job>;
    private taskCommunication : TaskCommunication;

    constructor(){
        this.jobs = new Map<string, Job>();
        this.taskCommunication = new TaskCommunication(this);
    }

    getStat(){
        const stat = new Array();

        this.jobs.forEach(element =>
            stat.push(
                element.getStat()
            ));
        return stat;
    }

    addJob(hash : string , jobState : JobState) : boolean{
        if(this.jobs.get(hash) === undefined) {
            const job = new Job(hash, this.taskCommunication, jobState);
            this.jobs.set(hash, job);
            this.taskCommunication.addJobAndSubscribe(job);
            return true;
        }
       return false;
    }

    addJobAndPropagate( hash : string) {
        this.addJob(hash, new JobState());
        this.taskCommunication.startJob(hash);
    }

    finishJob(hash : string, result :string){
        const job = this.jobs.get(hash);
        if(job !== undefined) {
            this.taskCommunication.removeJobAndUnsubscribe(job);
            job.finish(result);
        }
    }
}