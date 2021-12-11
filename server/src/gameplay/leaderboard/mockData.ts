import { GameType } from './enums/GameType';

export const userPoints = [
    { userId: '1', name: 'Harry', points: 5, rank: 1 },
    { userId: '2', name: 'Ron', points: 3, rank: 2 },
    { userId: '3', name: 'James', points: 2, rank: 3 },
    { userId: '4', name: 'Luna', points: 1, rank: 4 },
];

export const gameHistory = [
    {
        game: GameType.GameOne,
        playerRanks: [
            {
                id: '1',
                name: 'Harry',
                rank: 1,
                finished: true,
                isActive: true,
            },
            {
                id: '2',
                name: 'Ron',
                rank: 2,
                finished: true,
                isActive: true,
            },
            {
                id: '3',
                name: 'James',
                rank: 3,
                finished: true,
                isActive: true,
            },
            {
                id: '4',
                name: 'Luna',
                rank: 4,
                finished: true,
                isActive: true,
            },
        ],
    },
];
