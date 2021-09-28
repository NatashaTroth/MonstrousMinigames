export interface EventMessage {
    type: string;
    roomId: string;
    userId?: string;
    [key: string]: any;
}
