import 'reflect-metadata';

import { leaderboard, roomId, usersWithNumbers } from '../../mockData';
import { GameTwo } from '../../../../src/gameplay';
import Sheep from '../../../../src/gameplay/gameTwo/classes/Sheep';
import Parameters from '../../../../src/gameplay/gameTwo/constants/Parameters';
import { GameTwoMessageTypes } from '../../../../src/gameplay/gameTwo/enums/GameTwoMessageTypes';
import { SheepStates } from '../../../../src/gameplay/gameTwo/enums/SheepStates';
import GameTwoEventEmitter from '../../../../src/gameplay/gameTwo/classes/GameTwoEventEmitter';


let gameTwo: GameTwo;
const users = usersWithNumbers;
describe('GameTwo Sheep Tests', () => {
    beforeEach(async () => {
        jest.spyOn(console, "log").mockImplementation();
        gameTwo = new GameTwo(roomId, leaderboard, 10, 10);
        jest.useFakeTimers();

        gameTwo.createNewGame(users);
        gameTwo.startGame();
        jest.advanceTimersByTime(gameTwo.countdownTime);
    });

    afterEach(() => {
        jest.clearAllTimers();
        gameTwo.cleanup();
    });

    it('should have the right number of sheep', async () => {
        expect(gameTwo.sheepService.sheep.length).toEqual(10);
    });

    it('should kill sheep if message is sent and user is in radius', async () => {
        const sheep = new Sheep(Parameters.PLAYERS_POSITIONS[0].x, Parameters.PLAYERS_POSITIONS[0].y, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep);

        const chooseMessage = {
            type: GameTwoMessageTypes.CHOOSE,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(chooseMessage);

        const killMessage = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(killMessage);
        expect(gameTwo.sheepService.sheep[sheep.id].state).toEqual(SheepStates.DECOY);
    });


    it('should kill the closer sheep if two sheep are in radius', async () => {
        const sheep = new Sheep(Parameters.PLAYERS_POSITIONS[0].x + Parameters.KILL_RADIUS - 1, Parameters.PLAYERS_POSITIONS[0].y + Parameters.KILL_RADIUS - 1, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep);

        const sheep2 = new Sheep(Parameters.PLAYERS_POSITIONS[0].x + Parameters.KILL_RADIUS, Parameters.PLAYERS_POSITIONS[0].y + Parameters.KILL_RADIUS, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep2);

        const sheep3 = new Sheep(Parameters.PLAYERS_POSITIONS[0].x + Parameters.KILL_RADIUS - 3, Parameters.PLAYERS_POSITIONS[0].y + Parameters.KILL_RADIUS - 3, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep3);
        gameTwo.sheepService.stopMoving();

        const chooseMessage = {
            type: GameTwoMessageTypes.CHOOSE,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(chooseMessage);

        const killMessage = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(killMessage);
        expect(gameTwo.sheepService.sheep[sheep3.id].state).toEqual(SheepStates.DECOY);
    });

    it('should not kill sheep if user has no kills left', async () => {
        if (gameTwo.players.get(users[0].id)) {
            gameTwo.players.get(users[0].id)?.setKillsLeft(0);
        }

        const sheep = new Sheep(Parameters.PLAYERS_POSITIONS[0].x, Parameters.PLAYERS_POSITIONS[0].y, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep);


        const chooseMessage = {
            type: GameTwoMessageTypes.CHOOSE,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(chooseMessage);

        const killMessage = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(killMessage);
        
        expect(gameTwo.sheepService.sheep[sheep.id].state).toEqual(SheepStates.ALIVE);
    });

    it('should not kill sheep if user is not in radius', async () => {
        const chooseMessage = {
            type: GameTwoMessageTypes.CHOOSE,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(chooseMessage);

        const killMessage = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(killMessage);

        const decoySheep = gameTwo.sheepService.sheep.filter(sheep => {
            return sheep.state === SheepStates.DECOY;
        })
        expect(decoySheep.length).toEqual(0);
    });

    it('should not kill sheep if user is not in radius', async () => {

        const sheep = new Sheep(Parameters.PLAYERS_POSITIONS[0].x, Parameters.PLAYERS_POSITIONS[0].y, gameTwo.sheepService.sheep.length);
        gameTwo.sheepService.sheep.push(sheep);


        const chooseMessage = {
            type: GameTwoMessageTypes.CHOOSE,
            roomId: roomId,
            userId: users[0].id
        }
        gameTwo.receiveInput(chooseMessage);

        const killMessage = {
            type: GameTwoMessageTypes.KILL,
            roomId: roomId,
            userId: users[0].id
        }

        const emitRemainingKills = jest.spyOn(GameTwoEventEmitter, "emitRemainingKills");

        gameTwo.receiveInput(killMessage);

        expect(emitRemainingKills).toHaveBeenCalledWith(roomId, users[0].id, Parameters.KILLS_PER_ROUND - 1);
    });
});
