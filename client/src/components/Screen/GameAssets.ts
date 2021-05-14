// import game1SoundEnd from '../../assets/audio/Game_1_Sound_End.wav';
import game1SoundLoop from '../../assets/audio/Game_1_Sound_Loop.wav';
import game1SoundStart from '../../assets/audio/Game_1_Sound_Start.wav';
import attention from '../../images/attention.png';
import forest from '../../images/backgroundGame.png';
// import finishLine from '../../images/finishLine.png';
import franz from '../../images/franz_spritesheet.png';
import goal from '../../images/goal.png';
import noah from '../../images/noah_spritesheet.png';
import spider from '../../images/spider.png';
// import startLine from '../../images/startLine.png';
import steffi from '../../images/steffi_spritesheet.png';
import susi from '../../images/susi_spritesheet.png';
// import track from '../../images/track.png';
import wood from '../../images/wood.png';

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

export const characters = [
    { name: 'franz', file: franz, properties: characterSpriteProperties },
    { name: 'susi', file: susi, properties: characterSpriteProperties },
    { name: 'noah', file: noah, properties: characterSpriteProperties },
    { name: 'steffi', file: steffi, properties: characterSpriteProperties },
];

export const images = [
    { name: 'forest', file: forest },
    { name: 'attention', file: attention },
    { name: 'goal', file: goal },
    { name: 'wood', file: wood },
    { name: 'spider', file: spider },
];
