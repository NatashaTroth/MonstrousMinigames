// import game1SoundEnd from '../../assets/audio/Game_1_Sound_End.wav';
import game1SoundLoop from '../../assets/audio/Game_1_Sound_Loop.wav';
import game1SoundStart from '../../assets/audio/Game_1_Sound_Start.wav';
// import finishLine from '../../images/finishLine.png';
import franz from '../../images/characters/franz_spritesheet.png';
import chasers from '../../images/characters/Mosquito.png';
import noah from '../../images/characters/noah_spritesheet.png';
// import startLine from '../../images/startLine.png';
import steffi from '../../images/characters/steffi_spritesheet.png';
import susi from '../../images/characters/susi_spritesheet.png';
import cave from '../../images/obstacles/cave/cave.png';
import hole from '../../images/obstacles/hole/hole.png';
import spider from '../../images/obstacles/spider/spider.png';
import stone from '../../images/obstacles/stone/stone.png';
// import track from '../../images/track.png';
import wood from '../../images/obstacles/wood/wood.png';
import attention from '../../images/ui/attention.png';
import forest2 from '../../images/ui/forest2.png';
import goal from '../../images/ui/goal.png';

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

// export interface{
//     name: string,
//     file: pending,

// }

export const characters = [
    { name: 'franz', file: franz, properties: characterSpriteProperties },
    { name: 'susi', file: susi, properties: characterSpriteProperties },
    { name: 'noah', file: noah, properties: characterSpriteProperties },
    { name: 'steffi', file: steffi, properties: characterSpriteProperties },
];

// obstacle textures have to have the same name as obstacle type - lowercase
export const images = [
    { name: 'forest2', file: forest2 },
    { name: 'attention', file: attention },
    { name: 'goal', file: goal },
    { name: 'treestump', file: wood },
    { name: 'stone', file: stone },
    { name: 'hole', file: hole },
    { name: 'spider', file: spider },
    { name: 'chasers', file: chasers },
    { name: 'cave', file: cave },
    { name: 'stone', file: stone },
];
