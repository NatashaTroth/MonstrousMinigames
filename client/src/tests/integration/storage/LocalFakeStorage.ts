/* istanbul ignore file */
export class LocalStorageFake implements Storage {
    store: { [key: string]: string } = {};
    length = 0;

    clear() {
        this.store = {};
    }

    getItem(key: string) {
        return this.store[key] || null;
    }

    setItem(key: string, value: string | number) {
        this.store[key] = String(value);
        this.setLength();
    }

    removeItem(key: string) {
        delete this.store[key];
        this.setLength();
    }

    setLength() {
        this.length = Object.keys(this.store).length;
    }

    key(index: number) {
        return String(index);
    }
}
