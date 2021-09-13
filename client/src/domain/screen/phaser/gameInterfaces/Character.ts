import { AnimationName } from '../enums';

export interface Character {
    name: string;
    // file: string;
    // stunnedFile: string;
    animations: Map<AnimationName, CharacterAnimation>;
    // stunnedAnimationName: string;
}

export interface CharacterAnimation {
    name: string;
    spritesheetName: string;
    file: string;
    properties: CharacterSpriteProperties;
}

export interface CharacterSpriteProperties {
    frameWidth: number;
    frameHeight: number;
}
