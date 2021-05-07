export interface Socket {
    listen: (callback: <T>(val: T) => void) => Promise<void>;
    emit: <T>(val: T) => Promise<void>;
}
