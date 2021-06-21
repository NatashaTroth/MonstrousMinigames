import game1SoundLoop from '../../assets/audio/Game_1_Sound_Loop.wav';
import game1SoundStart from '../../assets/audio/Game_1_Sound_Start.wav';
import flaresJsonFile from '../../assets/flares/flares.json';
import flaresPngFile from '../../assets/flares/flares.png';
import floor from "../../images/background/floor.png";
import hills from "../../images/background/hills.png";
import moon from "../../images/background/moon.png";
import mountains from "../../images/background/mountains.png";
import starsAndSky from "../../images/background/starsAndSky.png";
import trees from "../../images/background/trees.png";
import franz from '../../images/characters/franz_spritesheet.png';
import chasers from '../../images/characters/Mosquito.png';
import noah from '../../images/characters/noah_spritesheet.png';
import steffi from '../../images/characters/steffi_spritesheet.png';
import susi from '../../images/characters/susi_spritesheet.png';
import cave from '../../images/obstacles/cave/cave.png';
import hole from '../../images/obstacles/hole/hole.png';
import spider from '../../images/obstacles/spider/spider.png';
import stone from '../../images/obstacles/stone/stone.png';
import wood from '../../images/obstacles/wood/wood.png';
import attention from '../../images/ui/attention.png';
import forest2 from '../../images/ui/forest2.png';
import forest2Smaller from '../../images/ui/forest2Smaller.png';
import forestTile from '../../images/ui/forestTile.png';
import { characterDictionary } from '../../utils/characterDictionary';

//TODO types

export const audioFiles = [
    { name: 'backgroundMusicStart', file: [game1SoundStart] },
    { name: 'backgroundMusicLoop', file: [game1SoundLoop] },
    { name: 'backgroundMusicStart', file: [game1SoundStart] },
];

const characterSpriteProperties = {
    frameWidth: 826,
    frameHeight: 1163,
};

export const characterFiles: string[] = [franz, noah, susi, steffi];
export const defaultAvailableCharacters = [
    characterDictionary.franz,
    characterDictionary.noah,
    characterDictionary.susi,
    characterDictionary.steffi,
];

export const characterSpriteSheetPrefix = 'character_';

export const characters = characterFiles.map((file, idx) => {
    return {
        name: `${characterSpriteSheetPrefix}${defaultAvailableCharacters[idx].toString()}`,
        file: file,
        properties: characterSpriteProperties,
    };
});

// obstacle textures have to have the same name as obstacle type - lowercase
export const images = [
    { name: 'forest2', file: forest2 },
    { name: 'forest2Smaller', file: forest2Smaller },
    { name: 'forestTile', file: forestTile },
    { name: 'attention', file: attention },
    { name: 'treestump', file: wood },
    { name: 'stone', file: stone },
    { name: 'hole', file: hole },
    { name: 'spider', file: spider },
    { name: 'chasers', file: chasers },
    { name: 'cave', file: cave },
    { name: 'stone', file: stone },
    { name: 'floor', file: floor },
    { name: 'hills', file: hills },
    { name: 'mountains', file: mountains },
    { name: 'starsAndSky', file: starsAndSky },
    { name: 'trees', file: trees },
    { name: 'moon', file: moon },
];

export const flaresPng = flaresPngFile;
export const flaresJson = flaresJsonFile;
