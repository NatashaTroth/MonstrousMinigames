import express from 'express';
import { Server } from 'socket.io';
import client from 'socket.io-client';

import ConnectionHandler from '../../src/services/connectionHandler';
import RoomService from '../../src/services/roomService';

const PORT = process.env.TEST_PORT || 5050

describe('connectionHandler', () => {
    let io: Server
    let rs: RoomService
    let ch: ConnectionHandler
    const url = `localhost:${PORT}`
    let expresServer
    let socket: SocketIOClient.Socket
    let server: HttpServer

    class HttpServer {
        public app = express()
    }

    beforeAll(done => {
        server = new HttpServer()

        const PORT = process.env.PORT || 5050
        expresServer = server.app.listen({ port: PORT })
        io = require('socket.io')(expresServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        })
        rs = new RoomService(100)
        ch = new ConnectionHandler(io, rs)
        ch.handle()
        done()
    })

    afterAll(done => {
        socket.close()
        done()
    })

    beforeEach(done => {
        console.log = jest.fn()
        socket = client(`http://${url}`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 10000,
        })
        socket.on('connect', (msg: any) => {
            done()
        })
    })

    it('should create a new room with the roomId the player used for connecting', () => {
        const roomId = 'AAAA'

        socket = client(`http://${url}/controller?roomId=${roomId}&name=Robin&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 10000,
        })
        const room = rs.getRoomById(roomId)
        expect(room.id).toEqual(roomId)
    })
})
