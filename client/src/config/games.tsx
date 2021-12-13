import game1Demo from '../images/ui/gameDemo.png';

export enum GameNames {
    game1 = 'game1',
    game2 = 'game2',
    game3 = 'game3',
}

export interface Game {
    id: GameNames;
    name: string;
    image: string;
    imageDescription: string;
}

export const games: Game[] = [
    {
        id: GameNames.game1,
        name: 'The Great Monster Escape',
        image: game1Demo,
        imageDescription:
            'Your goal is to be the first player to reach safety in the cave while conquering obstacles along the way!',
    },
    {
        id: GameNames.game2,
        name: 'Sheep World',
        image: game1Demo,
        imageDescription: 'Kill sheep',
    },
    {
        id: GameNames.game3,
        name: 'Snapshot Marathon',
        image: game1Demo,
        imageDescription: 'Take photos',
    },
];
