import {Job, JobCommunication, JobState} from "../job";

export class JobManager{

    private jobs : Map<string, Job>;
    private jobCommunication : JobCommunication;

    constructor(){
        this.jobs = new Map<string, Job>();
        this.jobCommunication = new JobCommunication(this);
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
        const job = this.jobs.get(hash);

        if(job === undefined) {
            const newJob = new Job(hash, this.jobCommunication, jobState)
            this.jobs.set(hash, newJob);
            this.jobCommunication.addJobAndSubscribe(newJob);
            return true;
        }else if(job.isFinished){
            this.jobCommunication.propagateFinishJob(hash, job.result);
        }

       return false;
    }

    addJobAndPropagate( hash : string) {
        this.addJob(hash, new JobState());
        this.jobCommunication.propagateStartJob(hash);
    }

    finishJob(hash : string, result :string){
        const job = this.jobs.get(hash);
        if(job !== undefined) {
            this.jobCommunication.removeJobAndUnsubscribe(job);
            job.finish(result);
        }
    }
}