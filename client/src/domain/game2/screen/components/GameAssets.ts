import game1SoundLoop from '../../../../assets/audio/Game_1_Sound_Loop.wav';
import game1SoundStart from '../../../../assets/audio/Game_1_Sound_Start.wav';
import { defaultAvailableCharacters } from '../../../../config/characters';
import blueMonster from '../../../../images/characters/spritesheets/monsters/blue_spritesheet.png';
import greenMonster from '../../../../images/characters/spritesheets/monsters/green_spritesheet.png';
import orangeMonster from '../../../../images/characters/spritesheets/monsters/orange_spritesheet.png';
import pinkMonster from '../../../../images/characters/spritesheets/monsters/pink_spritesheet.png';
import forest2 from '../../../../images/ui/forest2.png';
import sheep from '../../../../images/ui/sheep.png';
import sheepDecoy from '../../../../images/ui/sheep_decoy.png';
import { AnimationName } from '../phaser/enums/AnimationNames';
import { Character, CharacterAnimation, CharacterSpriteProperties } from '../phaser/gameInterfaces/Character';

//TODO types

export const audioFiles = [
    { name: 'backgroundMusicStart', file: [game1SoundStart] },
    { name: 'backgroundMusicLoop', file: [game1SoundLoop] },
];

const characterSpriteProperties: CharacterSpriteProperties = {
    frameWidth: 620,
    frameHeight: 873,
};

export const characterFiles: string[] = [blueMonster, greenMonster, pinkMonster, orangeMonster];

export const characterSpriteSheetPrefix = 'character_';

export const characters: Character[] = characterFiles.map((file, idx) => {
    const monsterName = `${characterSpriteSheetPrefix}${defaultAvailableCharacters[idx].toString()}`;
    const animationsMap = new Map<AnimationName, CharacterAnimation>();
    animationsMap.set(AnimationName.Running, {
        name: `${monsterName}_running`,
        frames: { start: 8, end: 11 },
    });
    return {
        name: monsterName,
        file: file,
        properties: characterSpriteProperties,

        animations: animationsMap,
    };
});

// obstacle textures have to have the same name as obstacle type - lowercase
export const images = [
    { name: 'forest2', file: forest2 },
    { name: 'sheep', file: sheep },
    { name: 'sheepDecoy', file: sheepDecoy },
];
