export interface Storage {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string | number) => void;
    removeItem: (key: string) => void;
}
