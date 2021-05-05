import Phaser from 'phaser'
import { stringify } from 'querystring'

import forest from '../../images/forest.png'
import franz from '../../images/franz_spritesheet.png'
import goal from '../../images/goal.png'
import noah from "../../images/noah_spritesheet.png"
import steffi from "../../images/steffi_spritesheet.png"
import susi from "../../images/susi_spritesheet.png"
import wood from '../../images/wood.png'

const players: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
const goals: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
const obstacles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
//let obstaclePositions: number[] = []
let playerNumber = 0
let roomId = ""
const moveplayers = [true, true, true, true]
const playerFinished = [false, false, false, false]
let socket: SocketIOClient.Socket
let trackLength = 0
const animations = ["franzWalk", "susiWalk", "noahWalk", "steffiWalk"]

let logged = false 

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }

    init(data:{roomId:string, playerNumber: number}){
        if(roomId === "" && data.roomId !== undefined){
            roomId = data.roomId
        }
        socket = this.handleSocketConnection()
    }

    preload(): void {
        this.load.spritesheet('franz', franz, { frameWidth: 826, frameHeight: 1163});
        this.load.spritesheet('susi', susi, { frameWidth: 826, frameHeight: 1163});
        this.load.spritesheet('noah', noah, { frameWidth: 826, frameHeight: 1163});
        this.load.spritesheet('steffi', steffi, { frameWidth: 826, frameHeight: 1163});

        this.load.image('forest', forest)
        this.load.image('goal', goal)
        this.load.image('wood', wood)
    }

    create() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const bg = this.add.image(windowWidth / 2, windowHeight / 2, 'forest');
        bg.setDisplaySize(windowWidth, windowHeight);

            players.push(this.physics.add.sprite(0, 10, 'franz'))
            players.push(this.physics.add.sprite(0, 300, 'susi'))
            players.push(this.physics.add.sprite(0, 500, 'noah'))
            players.push(this.physics.add.sprite(0, 700, 'steffi'))


        players.forEach(player => {
            player.setBounce(0.2)
            player.setCollideWorldBounds(true)
            player.setScale(0.2, 0.2)
            player.setCollideWorldBounds(true)
        })

        this.anims.create({
            key: 'franzWalk',
            frames: this.anims.generateFrameNumbers('franz', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1
        });
        
        this.anims.create({
            key: 'susiWalk',
            frames: this.anims.generateFrameNumbers('susi', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1
        });
        
        this.anims.create({
            key: 'noahWalk',
            frames: this.anims.generateFrameNumbers('noah', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1
        });
        
        this.anims.create({
            key: 'steffiWalk',
            frames: this.anims.generateFrameNumbers('steffi', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1
        });
        
        }

        handleMessage(data: any){
            if(data.type == "error"){
                this.handleError(data.msg)
            } else {
                if (trackLength === 0 && data.data !== undefined) {
                    trackLength = data.data.trackLength
                }
                if (!roomId) {
                    roomId = data.data.roomId
                }
                if(data.type === "game1/gameState"){
                    if(logged == false){

                        logged = true
                        if(playerNumber == 0){
                            playerNumber = data.data.playersState.length

                            if(playerNumber < 4){
                                for(let i = playerNumber; i < 4; i++){
                                    players[i].destroy()
                                }
                            }
                            for(let i = 0; i < playerNumber; i++){
                                players[i].anims.play(animations[i])
                                if(obstacles.length == 0)
                                    this.setObstacles(i, data.data.playersState[i].obstacles)
                                    this.setGoal(i)
                            }
                        }
                        
                    }
                    
                    this.updateGameState(data.data.playersState)
                }
            
            }
        }

        setGoal(playerIndex: number){
            const goal = this.physics.add.sprite(trackLength, this.getYPosition(playerIndex), 'goal')
            goal.setScale(0.1,0.1)
            goals.push(goal)
        }

        getYPosition(playerIndex: number){
            switch(playerIndex){
                case 0: return 100
                case 1: return 300
                case 2: return 500
                case 3: return 700
                default: return 0;
            }
        }

        setObstacles(playerIndex: number, obstacleArray: [{id: number, positionX: number, type: string}]){
            const yPosition = this.getYPosition(playerIndex)
            let obstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
            for(let i = 0; i < obstacleArray.length; i++){
                obstacle = this.placeObstacle(obstacleArray[i].positionX, yPosition, obstacleArray[i].type)
                obstacle.setScale(0.5, 0.5)
                obstacles.push(obstacle)
            }
            
        }

        placeObstacle(x: number, y: number, type: string){
            // eslint-disable-next-line no-console
            console.log(`x: ${  x  }y: ${  y  }${type}`)
            let textureName = "TreeStump"
            switch(type){
                case "Spider": textureName = "wood"; break
                case "Wood": textureName = "wood"; break;
                default: textureName = "wood"
            }
            return this.physics.add.sprite(x, y, textureName)
        }
        

        handleError(msg: string){
            this.add.text(32, 32, `Error: ${  msg}`, { font: "30px Arial"});
            players.forEach(player => {
                player.destroy()
            });

            obstacles.forEach(obstacle => {
                obstacle.destroy()
            });
        }

        removePlayerSprite(index: number){
            players[index].destroy()
        }


        updateGameState(playerData: any){
            for(let i = 0; i < playerNumber; i++){
                if(players[i] !== undefined && playerData !== undefined)
                    this.moveForward(players[i], playerData[i].positionX)
            }
        }

    update() {
        socket.on("message", (data: any ) => this.handleMessage(data))
        for (let i = 0; i < players.length; i++) {
            if (!moveplayers[i]) {
                players[i].anims.stop()
            }
            this.physics.collide(players[i], goals[i], () => {
                this.playerReachedGoal(i)
            })

        }

        if(players[0]){
        this.physics.collide(players[0], obstacles[0], () => {
            this.playerHitObstacle(0)
        })
        this.physics.collide(players[0], obstacles[1], () => {
            this.playerHitObstacle(0)
        })
    }
    if(players[1]){
        this.physics.collide(players[1], obstacles[2], () => {
            this.playerHitObstacle(1)
        })
        this.physics.collide(players[1], obstacles[3], () => {
            this.playerHitObstacle(1)
        })
    }
    if(players[2]){
        this.physics.collide(players[2], obstacles[4], () => {
            this.playerHitObstacle(2)
        })
        this.physics.collide(players[2], obstacles[5], () => {
            this.playerHitObstacle(2)
        })
    }
       if(players[3]){
        this.physics.collide(players[3], obstacles[6], () => {
            this.playerHitObstacle(3)
        })
        this.physics.collide(players[3], obstacles[7], () => {
            this.playerHitObstacle(3)
        })
       }
    }

    handleSocketConnection(){
        if(roomId == "" || roomId == undefined){
            this.handleError("No room code")
        }
        const socket = io(
            `${process.env.REACT_APP_BACKEND_URL}screen?${stringify({
                roomId: roomId,
            })}`,
            {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
            }
        );
        return socket
    
    }

    moveForward(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, toX: number) {
        player.x = toX
    }

    playerReachedGoal(playerIndex: number) {
        players[playerIndex].anims.stop()
        moveplayers[playerIndex] = false
        playerFinished[playerIndex] = true
    }
    playerHitObstacle(playerIndex: number) {
        moveplayers[playerIndex] = false
    }

    obstacleRemoved(obstacleIndex: number, playerIndex: number) {
        obstacles[obstacleIndex].destroy()
        moveplayers[playerIndex] = true
    }
}

export default MainScene
