import 'reflect-metadata';

import dotenv from 'dotenv';

import client from 'socket.io-client';

import axios from 'axios';

import DI, { DI_CRON_JOB_CLEANUP, DI_EVENT_MESSAGE_EMITTERS, DI_EXPRESS_PORT, DI_ROOM_NUMBER } from '../../src/di';
import App from '../../src/classes/App';
import { GlobalEventMessageEmitter } from '../../src/classes/GlobalEventMessageEmitter';
import { Globals } from '../../src/enums/globals';
import { GameOneEventMessageEmitter } from '../../src/gameplay/gameOne/GameOneEventMessageEmitter';
import { GameTwoMessageEmitter } from '../../src/gameplay/gameTwo/classes/GameTwoMessageEmitter';

// import { GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE } from '../../src/gameplay/gameTwo/interfaces/GameTwoEventMessages';

dotenv.config({
    path: '.env',
});

const PORT = 5561;

DI.register(DI_ROOM_NUMBER, { useValue: 100 });
DI.register(DI_EXPRESS_PORT, { useValue: PORT });
DI.register(DI_CRON_JOB_CLEANUP, { useValue: Globals.CRON_JOB_CLEANUP });

// *************** Event Messengers *******
DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GlobalEventMessageEmitter });
DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GameOneEventMessageEmitter });
DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GameTwoMessageEmitter });


let app = DI.resolve(App);

const url = `localhost:${PORT}`;
let roomCode: string;
let controller: SocketIOClient.Socket;


app = DI.resolve(App);
app.run();

describe('App Tests:', () => {
    beforeEach(done => {
        console.log = jest.fn();
        console.info = jest.fn();
        done();
    });

    afterAll(done => {
        app.shutdown();
        done();
    });
    afterEach(async done => {
        jest.clearAllMocks();
        done();
    });

    beforeEach(async done => {
        roomCode = await axios.get(`http://${url}/create-room`).then(resp => {
            return resp.data ? resp.data.roomId : '1234';
        });
        done();

    });

    it('should get a room code on request', async done => {
        await axios.get(`http://${url}/create-room`).then(resp => {
            expect(resp.data.roomId).not.toBeNull();
            done();

        });
    });
    it('should send a message of type userinit with the given username on connection', async done => {
        const username = 'John';

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });

        controller.on('message', (msg: any) => {
            if (msg.type === 'userInit') {
                expect(msg.name).toEqual(username);
                done();
            }
        });
    });
});
