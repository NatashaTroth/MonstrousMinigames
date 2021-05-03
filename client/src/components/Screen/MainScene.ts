
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
const playerNumber = 1
let roomId = ""
const moveplayers = [true, true, true, true]
const playerFinished = [false, false, false, false]
let socket 

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }

    init(data:{roomId?:string}){
        if(roomId !== undefined){
            roomId = data.roomId!
        }
    }

    preload(): void {
        this.load.spritesheet('franz', franz, { frameWidth: 826, frameHeight: 1163});
        this.load.spritesheet('susi', susi, { frameWidth: 826, frameHeight: 1163});
        this.load.spritesheet('noah', noah, { frameWidth: 826, frameHeight: 1163});
        this.load.spritesheet('steffi', steffi, { frameWidth: 826, frameHeight: 1163});

        this.load.image('forest', forest)
        this.load.image('goal', goal)
        this.load.image('wood', wood)

        this.load.audio('music', ['../../audio/Sound_Game.wav']);
    }

    create() {
        //this.sound.add("music", { loop: false });
        const forest = this.add.image(0, 0, 'forest')

        players.push(this.physics.add.sprite(10, 10, 'franz'))
        goals.push(this.physics.add.sprite(1600, 100, 'goal'))

        if(playerNumber >= 2){
            players.push(this.physics.add.sprite(68, 300, 'susi'))
            goals.push(this.physics.add.sprite(1050, 300, 'goal'))
        }
        if(playerNumber >= 3){
            players.push(this.physics.add.sprite(68, 500, 'noah'))
            goals.push(this.physics.add.sprite(1050, 500, 'goal'))
        }
        if(playerNumber >= 4){
            players.push(this.physics.add.sprite(68, 700, 'steffi'))
            goals.push(this.physics.add.sprite(1050, 700, 'goal'))
        }

        const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 600) + 200)

        for (let i = 0; i < playerNumber*2; i++) {
            let wood: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
            if (playerNumber >= 2 && i < 4) {
                wood = this.physics.add.sprite(arr[i], 300, 'wood')
            } else if (playerNumber >= 3 && i < 6) {
                wood = this.physics.add.sprite(arr[i], 500, 'wood')
            } else if(playerNumber >= 4) {
                wood = this.physics.add.sprite(arr[i], 700, 'wood')
            } else {
                wood = this.physics.add.sprite(arr[i], 100, 'wood')
            }

            wood.setScale(0.5, 0.5)
            obstacles.push(wood)
        }

        players.forEach(player => {
            player.setBounce(0.2)
            player.setCollideWorldBounds(true)
            player.setScale(0.2, 0.2)
            player.setCollideWorldBounds(true)
        })

        forest.setScale(1.8, 1.4)
        goals.forEach(goal => {
            goal.setScale(0.1,0.1)
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
        const animations = ["franzWalk", "susiWalk", "noahWalk", "steffiWalk"]
        for(let i = 0; i < playerNumber; i++){
            players[i].anims.play(animations[i])
        }
        }

        logMessage(data: any){
            // eslint-disable-next-line no-console
            console.log(data)
        }
        

    update() {
        socket = this.handleSocketConnection()
        socket.on("message", (data: any ) => this.logMessage(data))
        for (let i = 0; i < players.length; i++) {
            if (players[i] && moveplayers[i]) {
                this.moveForward(players[i])
            } else {
                players[i].anims.stop()
            }
            this.physics.collide(players[i], goals[i], () => {
                this.player1ReachedGoal(i)
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

    moveForward(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        player.x += 1
    }

    player1ReachedGoal(playerIndex: number) {
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
