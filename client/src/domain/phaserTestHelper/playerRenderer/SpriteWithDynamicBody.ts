export interface SpriteWithDynamicBody {
    x: number;
    y: number;
    displayHeight: number;
    setScale: (val: number) => void;
    setDepth: (val: number) => void;
    play: (val: string) => void;
    on: (val: string, method: () => void) => void;
    destroy: () => void;
}
