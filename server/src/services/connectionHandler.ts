import User from '../classes/user'
import RoomService from './roomService'
import { ObstacleReachedInfo, PlayerFinishedInfo } from '../gameplay/catchFood/interfaces'
import GameEventEmitter from '../classes/GameEventEmitter'
import { CatchFoodMsgType } from '../gameplay/catchFood/interfaces/CatchFoodMsgType'
import { GameEventTypes, GameHasStarted, GameHasFinished } from '../gameplay/interfaces/index'
import { Namespaces } from '../enums/nameSpaces'
import { MessageTypes } from '../enums/messageTypes'
import { Server, Namespace } from 'socket.io'
import emitter from '../helpers/emitter'
import { IMessage } from '../interfaces/messages'

class ConnectionHandler {
    private io: Server
    private gameEventEmitter: GameEventEmitter
    private rs: RoomService
    private controllerNamespace: Namespace
    private screenNameSpace: Namespace

    constructor(io: Server, rs: RoomService) {
        this.io = io
        this.gameEventEmitter = GameEventEmitter.getInstance()
        this.rs = rs
        this.controllerNamespace = this.io.of(Namespaces.CONTROLLER)
        this.screenNameSpace = this.io.of(Namespaces.SCREEN)
    }

    public handle(): void {
        this.handleControllers()
        this.handleScreens()
        this.handleGameEvents()
    }
    private handleControllers() {
        const rs = this.rs
        const controllerNamespace = this.controllerNamespace
        const screenNameSpace = this.screenNameSpace

        this.controllerNamespace.on('connection', function (socket) {
            const roomId = socket.handshake.query.roomId
            const room = rs.getRoomById(roomId)
            const name = socket.handshake.query.name
            let user: User

            let userId = socket.handshake.query.userId
            if (userId) {
                user = room.getUserById(userId)
                if (user) {
                    user.setRoomId(roomId)
                    user.setSocketId(socket.id)
                    user.setActive(true)
                } else {
                    user = new User(room.id, socket.id, name)
                    userId = user.id

                    if (!room.addUser(user)) {
                        emitter.sendErrorMessage(socket, 'Cannot join. Game already started')
                        console.error('User tried to join. Game already started: ' + userId)
                        return
                    }
                }
            } else {
                user = new User(room.id, socket.id, name)
                userId = user.id

                if (!room.addUser(user)) {
                    emitter.sendErrorMessage(socket, 'Cannot join. Game already started')
                    console.error('User tried to join. Game already started: ' + userId)
                    return
                }
            }

            emitter.sendConnectedUsers(screenNameSpace, room)
            console.log(roomId + ' | Controller connected: ' + userId)

            emitter.sendUserInit(socket, user, room)
            socket.join(roomId)
            socket.on('disconnect', () => {
                console.log(roomId + ' | Controller disconnected: ' + userId)
                room.userDisconnected(userId)

                if (room.isOpen()) {
                    emitter.sendConnectedUsers(screenNameSpace, room)
                    const admin = room.admin
                    if (admin) {
                        controllerNamespace.to(admin.socketId).emit('message', {
                            type: MessageTypes.USER_INIT,
                            userId: admin.id,
                            roomId: room.id,
                            name: admin.name,
                            isAdmin: room.isAdmin(admin),
                        })
                    }
                }
            })

            socket.on('message', function (message: IMessage) {
                const type = message.type
                switch (type) {
                    case CatchFoodMsgType.START: {
                        if (room.isOpen()) {
                            rs.startGame(room)

                            emitter.sendGameState(screenNameSpace, room)

                            const gameStateInterval = setInterval(() => {
                                if (!room.isPlaying) {
                                    clearInterval(gameStateInterval)
                                }
                                emitter.sendGameState(screenNameSpace, room, true)
                            }, 100)
                        }

                        break
                    }
                    case CatchFoodMsgType.MOVE: {
                        if (room.isPlaying()) {
                            room.game?.runForward(userId, parseInt(`${process.env.SPEED}`, 10) || 1)
                        }
                        break
                    }
                    case CatchFoodMsgType.OBSTACLE_SOLVED: {
                        room.game?.playerHasCompletedObstacle(userId)
                        break
                    }
                    case MessageTypes.RESET_GAME:
                        {
                            if (!room.isOpen()) {
                                if (room.isAdmin(user)) {
                                    console.log(roomId + ' | Reset Game')
                                    room.resetGame().then(() => {
                                        emitter.sendMessage(
                                            MessageTypes.GAME_HAS_RESET,
                                            [controllerNamespace, screenNameSpace],
                                            room.id
                                        )
                                        emitter.sendConnectedUsers(screenNameSpace, room)
                                        emitter.sendUserInit(socket, user, room)
                                    })
                                }
                            }
                        }
                        break
                    default: {
                        console.log(message)
                    }
                }
            })
        })
    }
    private handleScreens() {
        const rs = this.rs
        const screenNameSpace = this.screenNameSpace

        this.screenNameSpace.on('connection', function (socket) {
            const roomId = socket.handshake.query.roomId ? socket.handshake.query.roomId : 'ABCDE'
            const room = rs.getRoomById(roomId)

            socket.join(room.id)
            console.log(roomId + ' | Screen connected')

            emitter.sendConnectedUsers(screenNameSpace, room)

            socket.on('disconnect', () => {
                console.log(roomId + ' | Screen disconnected')
            })

            socket.on('message', function (message: IMessage) {
                console.log(message)

                socket.broadcast.emit('message', message)
            })
        })
    }
    private handleGameEvents() {
        const rs = this.rs
        const controllerNamespace = this.controllerNamespace
        const screenNameSpace = this.screenNameSpace
        this.gameEventEmitter.on(GameEventTypes.ObstacleReached, (data: ObstacleReachedInfo) => {
            console.log(data.roomId + ' | userId: ' + data.userId + ' | Obstacle: ' + data.obstacleType)
            const r = rs.getRoomById(data.roomId)
            const u = r.getUserById(data.userId)
            if (u) {
                this.controllerNamespace.to(u.socketId).emit('message', {
                    type: CatchFoodMsgType.OBSTACLE,
                    obstacleType: data.obstacleType,
                })
            }
        })
        this.gameEventEmitter.on(GameEventTypes.PlayerHasFinished, (data: PlayerFinishedInfo) => {
            console.log(data.roomId + ' | userId: ' + data.userId + ' | Rank: ' + data.rank)
            const room = rs.getRoomById(data.roomId)
            const user = room.getUserById(data.userId)
            if (user) {
                emitter.sendPlayerFinished(controllerNamespace, user, data)
            }
        })
        this.gameEventEmitter.on(GameEventTypes.GameHasStarted, (data: GameHasStarted) => {
            console.log(data.roomId + ' | Game has started!')
            emitter.sendGameHasStarted([controllerNamespace, screenNameSpace], data)
        })
        this.gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameHasFinished) => {
            console.log(data.roomId + ' | Game has finished')
            const room = rs.getRoomById(data.roomId)
            room.setClosed()
            emitter.sendGameHasFinished([controllerNamespace, screenNameSpace], data)
        })
    }
}

export default ConnectionHandler
