import game1SoundLoop from '../../../assets/audio/Game_1_Sound_Loop.wav';
import game1SoundStart from '../../../assets/audio/Game_1_Sound_Start.wav';
import flare1 from '../../../assets/flares/flare_01.png';
import flare2 from '../../../assets/flares/flare_02.png';
import flare3 from '../../../assets/flares/flare_03.png';
import flaresJsonFile from '../../../assets/flares/flares.json';
import flaresPngFile from '../../../assets/flares/flares.png';
import floor from '../../../images/background/floor.png';
import hills from '../../../images/background/hills.png';
import laneBackground from '../../../images/background/laneBackground.png';
import moon from '../../../images/background/moon.png';
import mountains from '../../../images/background/mountains.png';
import starsAndSky from '../../../images/background/starsAndSky.png';
import trees from '../../../images/background/trees.png';
import chasers from '../../../images/characters/Mosquito.png';
import blueMonster from '../../../images/characters/spritesheets/blue_spritesheet.png';
import greenMonster from '../../../images/characters/spritesheets/green_spritesheet.png';
import orangeMonster from '../../../images/characters/spritesheets/orange_spritesheet.png';
import pinkMonster from '../../../images/characters/spritesheets/pink_spritesheet.png';
import caveBehind from '../../../images/obstacles/cave/cave_behind.png';
import caveInFront from '../../../images/obstacles/cave/cave_in_front.png';
import spider from '../../../images/obstacles/spider/spider.png';
import stone from '../../../images/obstacles/stone/stone.png';
import trash from '../../../images/obstacles/trash/trash.png';
import wood from '../../../images/obstacles/wood/wood.png';
import attention from '../../../images/ui/attention.png';
import forest2 from '../../../images/ui/forest2.png';
import forest2Smaller from '../../../images/ui/forest2Smaller.png';
import forestTile from '../../../images/ui/forestTile.png';
import { characterDictionary } from '../../../utils/characterDictionary';
import { AnimationName } from '../phaser/enums';
import { Character, CharacterAnimation, CharacterSpriteProperties } from '../phaser/gameInterfaces';

//TODO types

export const audioFiles = [
    { name: 'backgroundMusicStart', file: [game1SoundStart] },
    { name: 'backgroundMusicLoop', file: [game1SoundLoop] },
    { name: 'backgroundMusicStart', file: [game1SoundStart] },
];

const characterSpriteProperties: CharacterSpriteProperties = {
    frameWidth: 620,
    frameHeight: 873,
};

export const characterFiles: string[] = [blueMonster, greenMonster, pinkMonster, orangeMonster];
export const defaultAvailableCharacters = [
    characterDictionary.franz,
    characterDictionary.noah,
    characterDictionary.susi,
    characterDictionary.steffi,
];

export const characterSpriteSheetPrefix = 'character_';

export const characters: Character[] = characterFiles.map((file, idx) => {
    const monsterName = `${characterSpriteSheetPrefix}${defaultAvailableCharacters[idx].toString()}`;
    const animationsMap = new Map<AnimationName, CharacterAnimation>();
    animationsMap.set(AnimationName.Running, {
        name: `${monsterName}_running`,
        frames: { start: 8, end: 11 },
    });
    animationsMap.set(AnimationName.Stunned, {
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
    { name: 'moon', file: moon },
    { name: 'laneBackground', file: laneBackground },
];

export const flaresPng = flaresPngFile;
export const flaresJson = flaresJsonFile;

export const fireworkFlares = [
    flare1,
    flare2,
    flare3,
    // {name: "fireworkFlare1", file:flare1}
];
