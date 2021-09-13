export interface IMessage {
    type: string;
    roomId?: string;
    userId?: string;
    characterNumber?: string;
    receivingUserId?: string;
    usingCollectedStone?: boolean;
}
