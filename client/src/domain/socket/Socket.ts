export interface Socket {
    listen: (callback: <T>(val: T) => void) => Promise<void>;
    unlisten: (callback: <T>(val: T) => void) => void;
    emit: <T>(val: T) => Promise<void>;
}
