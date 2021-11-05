import { SpriteWithDynamicBody } from './SpriteWithDynamicBody';

export interface Scene {
    anims: {
        create: (val: { key: string; frames: string | any | undefined; frameRate: number; repeat: number }) => void;
        generateFrameNumbers: (name: string, val: { start: number; end: number }) => void;
    };
    physics: {
        add: {
            sprite: (x: number, y: number, name: string) => SpriteWithDynamicBody | undefined;
        };
    };
}
