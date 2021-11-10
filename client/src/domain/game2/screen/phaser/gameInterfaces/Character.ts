import { AnimationName } from '../enums/AnimationNames';

export interface Character {
    name: string;
    file: string;
    animations: Map<AnimationName, CharacterAnimation>;
    properties: CharacterSpriteProperties;
}

export interface CharacterAnimation {
    name: string;
    frames: CharacterAnimationFrames;
}

export interface CharacterAnimationFrames {
    start: number;
    end: number;
}
export interface CharacterSpriteProperties {
    frameWidth: number;
    frameHeight: number;
}
