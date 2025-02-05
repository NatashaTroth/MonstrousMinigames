import game1SoundLoop from '../../../../assets/audio/Game_1_Sound_Loop.wav';
import game1SoundStart from '../../../../assets/audio/Game_1_Sound_Start.wav';
import flare1 from '../../../../assets/flares/flare_01.png';
import flare2 from '../../../../assets/flares/flare_02.png';
import flare3 from '../../../../assets/flares/flare_03.png';
import { defaultAvailableCharacters } from '../../../../config/characters';
import floor from '../../../../images/background/floor.png';
import grass from '../../../../images/background/grass.png';
import hills from '../../../../images/background/hills.png';
import laneBackground from '../../../../images/background/laneBackground.png';
import moon from '../../../../images/background/moon.png';
import mountains from '../../../../images/background/mountains.png';
import starsAndSky from '../../../../images/background/starsAndSky.png';
import trees from '../../../../images/background/trees.png';
import chasers from '../../../../images/characters/Mosquito.png';
import blueMonster from '../../../../images/characters/spritesheets/monsters/blue_spritesheet.png';
import greenMonster from '../../../../images/characters/spritesheets/monsters/green_spritesheet.png';
import orangeMonster from '../../../../images/characters/spritesheets/monsters/orange_spritesheet.png';
import pinkMonster from '../../../../images/characters/spritesheets/monsters/pink_spritesheet.png';
import caveBehind from '../../../../images/obstacles/cave/cave_behind.png';
import caveInFront from '../../../../images/obstacles/cave/cave_in_front.png';
import spider from '../../../../images/obstacles/spider/spider.png';
import pebble from '../../../../images/obstacles/stone/pebble.png';
import stone from '../../../../images/obstacles/stone/stone.png';
import trash from '../../../../images/obstacles/trash/trash.png';
import wood from '../../../../images/obstacles/wood/wood.png';
import attention from '../../../../images/ui/attention.png';
import forest2 from '../../../../images/ui/forest2.png';
import forest2Smaller from '../../../../images/ui/forest2Smaller.png';
import forestTile from '../../../../images/ui/forestTile.png';
import warning from '../../../../images/ui/warning.png';
import { AnimationNameGame1 } from '../../../phaser/enums/AnimationName';
import { Character, CharacterAnimation, CharacterSpriteProperties } from '../../../phaser/gameInterfaces';

export const audioFiles = [
    { name: 'backgroundMusicStart', file: [game1SoundStart] },
    { name: 'backgroundMusicLoop', file: [game1SoundLoop] },
];

const characterSpriteProperties: CharacterSpriteProperties = {
    frameWidth: 620,
    frameHeight: 876,
};

export const characterFiles: string[] = [blueMonster, greenMonster, pinkMonster, orangeMonster];

export const characterSpriteSheetPrefix = 'character_';

export const characters: Character[] = characterFiles.map((file, idx) => {
    const monsterName = `${characterSpriteSheetPrefix}${defaultAvailableCharacters[idx].toString()}`;
    const animationsMap = new Map<AnimationNameGame1, CharacterAnimation>();
    animationsMap.set(AnimationNameGame1.Running, {
        name: `${monsterName}_running`,
        frames: { start: 8, end: 11 },
    });
    animationsMap.set(AnimationNameGame1.Stunned, {
        name: `${monsterName}_stunned`,
        frames: { start: 12, end: 15 },
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
    { name: 'forest2Smaller', file: forest2Smaller },
    { name: 'forestTile', file: forestTile },
    { name: 'attention', file: attention },
    { name: 'warning', file: warning },
    { name: 'tree_stump', file: wood },
    { name: 'stone', file: stone },
    { name: 'trash', file: trash },
    { name: 'spider', file: spider },
    { name: 'chasers', file: chasers },
    { name: 'caveBehind', file: caveBehind },
    { name: 'caveInFront', file: caveInFront },
    { name: 'stone', file: stone },
    { name: 'floor', file: floor },
    { name: 'hills', file: hills },
    { name: 'mountains', file: mountains },
    { name: 'starsAndSky', file: starsAndSky },
    { name: 'trees', file: trees },
    { name: 'grass', file: grass },
    { name: 'moon', file: moon },
    { name: 'laneBackground', file: laneBackground },
    { name: 'pebble', file: pebble },
];

export const fireworkFlares = [flare1, flare2, flare3];
