import Ping from "./ping"
import NewJob from "./newJob"
import StartTask from "./startTask"
import EndTask from "./endTask"
import EndJob from "./endJob"

export default interface Message{
    sender: string,
    data : Ping | EndJob | NewJob | StartTask | EndTask,
}