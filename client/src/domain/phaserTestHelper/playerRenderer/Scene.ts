import { GameObjectText } from '../GameObjects/Text';
import { SpriteWithDynamicBody } from './SpriteWithDynamicBody';

export interface Scene {
    windowWidth: number;
    windowHeight: number;
    anims: {
        create: (val: { key: string; frames: string | any | undefined; frameRate: number; repeat: number }) => void;
        generateFrameNumbers: (name: string, val: { start: number; end: number }) => void;
    };
    physics: {
        add: {
            sprite: (x: number, y: number, name: string, z?: number) => SpriteWithDynamicBody;
        };
    };
    make: {
        text: (props: { x: number; y: number; text: string; style: any; add: boolean }) => GameObjectText;
    };
}
