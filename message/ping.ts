import { MessageType } from './messageType';

export default interface Ping{
    type : MessageType.PING,
    othersHosts : Host[];
}