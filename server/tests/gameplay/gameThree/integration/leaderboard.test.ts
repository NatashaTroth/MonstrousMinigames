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
import {
    addPointsToPlayer, advanceCountdown, startGameAdvanceCountdown, startNewRound,
    switchToSecondToLastRound
} from '../gameThreeHelperFunctions';
import { receiveMultiplePhotos } from '../gameThreeMockData';

let gameThree: GameThree;
const gameEventEmitter = DI.resolve(GameEventEmitter);

describe('Leaderboard tests for Game Three', () => {
    beforeEach(() => {
        Date.now = () => dateNow;
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        startGameAdvanceCountdown(gameThree);
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        switchToSecondToLastRound(gameThree); //skip to final round
        startNewRound(gameThree);
        receiveMultiplePhotos(gameThree); // to pass no photos error in FinalPhotosStage
        advanceCountdown(
            gameThree,
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME
        );
        users.forEach(() => advanceCountdown(gameThree, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS));
        // add points

        addPointsToPlayer(gameThree, users);
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
