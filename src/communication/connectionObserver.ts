export interface ConnectionObserver{
    notifyNewConnection( connectionId : string) : void;
    notifyRemoveConnection( connectionId : string) : void;
}