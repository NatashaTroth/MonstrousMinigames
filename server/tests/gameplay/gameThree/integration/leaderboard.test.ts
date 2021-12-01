import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameThree } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage, GlobalGameHasFinished
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { GameType } from '../../../../src/gameplay/leaderboard/enums/GameType';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { advanceCountdown, startGameAdvanceCountdown } from '../gameThreeHelperFunctions';
import { receiveMultiplePhotos } from '../gameThreeMockData';

let gameThree: GameThree;
const gameEventEmitter = DI.resolve(GameEventEmitter);

describe('Leaderboard tests for Game Three', () => {
    let pointsArray: number[];

    beforeEach(() => {
        pointsArray = [];
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        const stageController = gameThree['stageController']!;
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        stageController!['roundIdx'] = InitialParameters.NUMBER_ROUNDS - 1; //skip to final round
        stageController!.handleNewRound();
        receiveMultiplePhotos(gameThree); // to pass no photos error in FinalPhotosStage
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        users.forEach(() => advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS));
        // add points

        users.forEach((user, idx) => {
            pointsArray.push(stageController['playerPoints'].getPointsFromPlayer(user.id)); // get points from before (from sending final photo)
            for (let i = 0; i < InitialParameters.NUMBER_ROUNDS; i++) {
                stageController['playerPoints'].addPointsToPlayer(user.id, idx);
                pointsArray[idx] += idx;
            }
        });
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should call addGameToHistory on leaderboard', async () => {
        const spy = jest.spyOn(leaderboard, 'addGameToHistory');
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should save the correct game type to leaderboard game history', async () => {
        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);
        expect(leaderboard.gameHistory[0].game).toBe(GameType.GameThree);
    });

    it('should save the game to leaderboard game history', async () => {
        let eventData: GlobalGameHasFinished = {
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED,
            roomId: 'xxx',
            data: {
                roomId: 'xx',
                gameState: GameState.Finished,
                playerRanks: [],
            },
        };

        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message;
            }
        });

        advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_VOTE);

        expect(leaderboard.gameHistory[0].playerRanks).toMatchObject(eventData.data.playerRanks);
    });
});
