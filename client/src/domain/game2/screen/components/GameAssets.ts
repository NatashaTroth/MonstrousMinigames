import game2SoundLoop from '../../../../assets/audio/Game_2_Sound_Loop.wav';
import { defaultAvailableCharacters } from '../../../../config/characters';
import sheepBackgroundGrass from '../../../../images/background/sheepBackgroundGrass.png';
import blueMonsterGame2 from '../../../../images/characters/spritesheets/monsters/blue_spritesheet.png';
import greenMonsterGame2 from '../../../../images/characters/spritesheets/monsters/green_spritesheet.png';
import orangeMonsterGame2 from '../../../../images/characters/spritesheets/monsters/orange_spritesheet.png';
import pinkMonsterGame2 from '../../../../images/characters/spritesheets/monsters/pink_spritesheet.png';
import sheepDecoy from '../../../../images/characters/spritesheets/sheep/sheep_decoy.png';
import { AnimationNameGame2 } from '../../../phaser/enums/AnimationName';
import { Character, CharacterAnimation, CharacterSpriteProperties } from '../../../phaser/gameInterfaces';

//TODO types

export const audioFiles = [{ name: 'backgroundMusicLoop', file: [game2SoundLoop] }];

const characterSpriteProperties: CharacterSpriteProperties = {
    frameWidth: 620,
    frameHeight: 873,
};

export const characterFiles: string[] = [blueMonsterGame2, greenMonsterGame2, pinkMonsterGame2, orangeMonsterGame2];

export const characterSpriteSheetPrefix = 'character_';

export const characters: Character[] = characterFiles.map((file, idx) => {
    const monsterName = `${characterSpriteSheetPrefix}${defaultAvailableCharacters[idx].toString()}Game2`;
    const animationsMap = new Map<AnimationNameGame2, CharacterAnimation>();
    animationsMap.set(AnimationNameGame2.Running, {
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
    { name: 'sheepGrass', file: sheepBackgroundGrass },
    { name: 'sheepDecoy', file: sheepDecoy },
];
