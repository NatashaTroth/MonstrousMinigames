import ConnectionHandler from '../../src/services/connectionHandler'
import RoomService from '../../src/services/roomService'

import client from 'socket.io-client'
import express from 'express'
import { Server } from 'socket.io'

describe('connectionHandler', () => {
    let io: Server
    let rs: RoomService
    let ch: ConnectionHandler
    const url = 'localhost:5000'
    let expresServer
    let socket

    beforeAll(done => {
        class Server {
            public app = express()
        }
        const server = new Server()
        const PORT = 5000
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
