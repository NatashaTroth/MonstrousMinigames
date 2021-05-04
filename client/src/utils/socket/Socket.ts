export interface Socket {
    listen: (callback: <T>(val: T) => void) => void;
    emit: <T>(val: T) => void;
}
