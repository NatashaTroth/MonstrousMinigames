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

export const characters: string[] = [franz, noah, susi, steffi];
export const defaultAvailableCharacters = [
    characterDictionary.franz,
    characterDictionary.noah,
    characterDictionary.susi,
    characterDictionary.steffi,
];

export const charactersStunned = [franz_stunned, noah_stunned, susi_stunned, steffi_stunned];
export const charactersGhosts = [franz_ghost, noah_ghost, susi_ghost, steffi_ghost];
