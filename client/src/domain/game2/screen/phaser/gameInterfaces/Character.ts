import { AnimationName } from '../enums/AnimationNames';

export interface Character {
    name: string;
    file: string;
    // stunnedFile: string;
    animations: Map<AnimationName, CharacterAnimation>;
    // stunnedAnimationName: string;
    properties: CharacterSpriteProperties;
}

export interface CharacterAnimation {
    name: string;
    // spritesheetName: string;
    // file: string;
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
