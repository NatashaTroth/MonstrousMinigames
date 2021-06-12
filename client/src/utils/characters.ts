import franz from '../images/characters/franz.png';
import noah from '../images/characters/noah.png';
import steffi from '../images/characters/steffi.png';
import susi from '../images/characters/susi.png';

export interface Character {
    id: number;
    src: string;
}
export const characters: Character[] = [
    { id: 1, src: franz },
    { id: 2, src: noah },
    { id: 3, src: susi },
    { id: 4, src: steffi },
];
