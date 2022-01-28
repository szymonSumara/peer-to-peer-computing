import { MessageType } from './messageType';
import Host from "../communication/host";

export default interface Ping{
    type : MessageType.PING,
    othersHosts : Host[];
}