import { AnimationNameGame1, AnimationNameGame2 } from '../enums/AnimationName';

export interface Character {
    name: string;
    file: string;
    animations: Map<AnimationNameGame1 | AnimationNameGame2, CharacterAnimation>;
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
