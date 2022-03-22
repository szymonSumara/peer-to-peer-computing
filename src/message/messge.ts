import {Ping, EndJob, EndTask, NewJob, StartTask} from "../message";

export  interface Message{
    sender: string,
    data : Ping | EndJob | NewJob | StartTask | EndTask,
}