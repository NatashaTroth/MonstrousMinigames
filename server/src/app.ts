import cors from 'cors';
import { CronJob } from 'cron';
import dotenv from 'dotenv';
import express from 'express';

import ConnectionHandler from './services/connectionHandler';
import RoomService from './services/roomService';

// load the environment variables from the .env file
dotenv.config({
    path: '.env',
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
    public app = express();
}

// initialize server app
const server = new Server();
server.app.use(cors());

server.app.get('/', (req, res) => {
    res.send('GAAAAME!');
});

const PORT = process.env.PORT || 5000;

const expresServer = server.app.listen({ port: PORT }, () => console.log(`> 🚀 Listening on port ${PORT}`));

const io = require('socket.io')(expresServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const roomCount: number = parseInt(`${process.env.ROOM_COUNT}`, 10) || 1000;

const rs = new RoomService(roomCount);

const test_room = process.env.TEST_ROOM;
if (test_room) rs.createRoom(test_room);

const ch = new ConnectionHandler(io, rs);
ch.handle();

let room_count = rs.roomCodes.length;
const cron = new CronJob(
    '0 * * * *',
    function () {
        try {
            room_count = rs.roomCodes.length;
            rs.cleanupRooms();
            if (rs.roomCodes.length - room_count > 0)
                console.info(`${rs.roomCodes.length - room_count} room(s) cleared`);
        } catch (e) {
            console.error(e);
        }
    },
    null,
    true
);
cron.start();

server.app.get('/create-room', (req, res) => {
    const room = rs.createRoom();

    res.send({ roomId: room.id });
    console.info(`${room.id} | Room created`);
});
