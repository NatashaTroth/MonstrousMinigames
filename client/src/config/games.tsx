import React, { ReactNode } from 'react';

import { Game1Description, Game2Description, Game3Description } from '../components/screen/ChooseGame';
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
    description: ReactNode;
}

export const games: Game[] = [
    {
        id: GameNames.game1,
        name: 'The Great Monster Escape',
        image: game1Demo,
        imageDescription:
            'Your goal is to be the first player to reach safety in the cave while conquering obstacles along the way!',
        description: <Game1Description />,
    },
    {
        id: GameNames.game2,
        name: 'Sheep World',
        image: game1Demo,
        imageDescription: 'Kill sheeps',
        description: <Game2Description />,
    },
    {
        id: GameNames.game3,
        name: 'Snapshot Marathon',
        image: game1Demo,
        imageDescription: 'Take photos',
        description: <Game3Description />,
    },
];
