export interface IMessage {
    type: string;
    roomId?: string;
    userId?: string;
    characterNumber?: string;
    state?: string;
    direction?: string;
    name?: string;
}
