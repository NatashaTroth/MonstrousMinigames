import franz from '../images/characters/franz.png';
import franz_ghost from '../images/characters/ghost_blue.png';
import noah_ghost from '../images/characters/ghost_green.png';
import steffi_ghost from '../images/characters/ghost_orange.png';
import susi_ghost from '../images/characters/ghost_pink.png';
import noah from '../images/characters/noah.png';
import steffi from '../images/characters/steffi.png';
import franz_stunned from '../images/characters/stunned_blue.png';
import noah_stunned from '../images/characters/stunned_green.png';
import steffi_stunned from '../images/characters/stunned_orange.png';
import susi_stunned from '../images/characters/stunned_pink.png';
import susi from '../images/characters/susi.png';
import { characterDictionary } from './characterDictionary';

export interface Character {
    id: string;
    src: string;
    stunned: string;
    ghost: string;
}

export const characters: Character[] = [
    { id: 'franz', src: franz, stunned: franz_stunned, ghost: franz_ghost },
    { id: 'noah', src: noah, stunned: noah_stunned, ghost: noah_ghost },
    { id: 'susi', src: susi, stunned: susi_stunned, ghost: susi_ghost },
    { id: 'steffi', src: steffi, stunned: steffi_stunned, ghost: steffi_ghost },
];

export const defaultAvailableCharacters = [
    characterDictionary.franz,
    characterDictionary.noah,
    characterDictionary.susi,
    characterDictionary.steffi,
];
