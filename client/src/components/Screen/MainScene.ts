import Phaser from 'phaser'

import forest from '../../images/forest.png'
import goal from '../../images/goal.png'
import monster2 from '../../images/monster2.png'
import oliverSpritesheet from '../../images/oliver_spritesheet.jpeg'
import unicorn from '../../images/unicorn.png'
import wood from '../../images/wood.png'

const players: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
const goals: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
const obstacles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
const moveplayers = [false, false, false, false]
const playerFinished = [false, false, false, false]

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }

    preload(): void {
        this.load.spritesheet('oliver', oliverSpritesheet, {
            frameWidth: 275,
            frameHeight: 400,
        })
        this.load.image('monster2', monster2)
        this.load.image('monster', '../../images/monster.png')
        this.load.image('unicorn', unicorn)
        this.load.image('forest', forest)
        this.load.image('goal', goal)
        this.load.image('wood', wood)
    }

    create() {
        const forest = this.add.image(0, 0, 'forest')
        const player1 = this.physics.add.sprite(10, 10, 'oliver')
        const player2 = this.physics.add.sprite(68, 300, 'oliver')
        const player3 = this.physics.add.sprite(68, 500, 'oliver')
        const player4 = this.physics.add.sprite(68, 700, 'oliver')
        const goal1 = this.physics.add.sprite(1050, 100, 'goal')
        const goal2 = this.physics.add.sprite(1050, 300, 'goal')
        const goal3 = this.physics.add.sprite(1050, 500, 'goal')
        const goal4 = this.physics.add.sprite(1050, 700, 'goal')

        players.push(player1, player2, player3, player4)
        goals.push(goal1, goal2, goal3, goal4)

        const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 600) + 200)

        for (let i = 0; i < 8; i++) {
            let wood: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
            if (i < 2) {
                wood = this.physics.add.sprite(arr[i], 100, 'wood')
            } else if (i < 4) {
                wood = this.physics.add.sprite(arr[i], 300, 'wood')
            } else if (i < 6) {
                wood = this.physics.add.sprite(arr[i], 500, 'wood')
            } else {
                wood = this.physics.add.sprite(arr[i], 700, 'wood')
            }

            wood.setScale(0.5, 0.5)
            obstacles.push(wood)
        }

        players.forEach(player => {
            player.setBounce(0.2)
            player.setCollideWorldBounds(true)
            player.setScale(0.5, 0.5)
            player.setCollideWorldBounds(true)
        })

        forest.setScale(1.2, 1.4)
        goal1.setScale(0.1, 0.1)
        goal2.setScale(0.1, 0.1)
        goal3.setScale(0.1, 0.1)
        goal4.setScale(0.1, 0.1)

        this.anims.create({
            key: 'forward',
            frames: this.anims.generateFrameNumbers('oliver', {
                start: 0,
                end: 3,
            }),
            frameRate: 6,
            repeat: -1,
        })
        this.anims.create({
            key: 'backwards',
            frames: this.anims.generateFrameNumbers('oliver', {
                start: 4,
                end: 7,
            }),
            frameRate: 6,
            repeat: -1,
        })
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('oliver', {
                start: 8,
                end: 11,
            }),
            frameRate: 6,
            repeat: -1,
        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('oliver', {
                start: 12,
                end: 15,
            }),
            frameRate: 6,
            repeat: -1,
        })

        players.forEach(player => {
            player.anims.play('right')
        })
    }

    update() {
        for (let i = 0; i < players.length; i++) {
            if (players[i] && moveplayers[i] && this.isGameOver()) {
                this.moveForward(players[i])
            } else {
                players[i].anims.stop()
            }
            this.physics.collide(players[i], goals[i], () => {
                this.player1ReachedGoal(i)
            })
        }

        this.physics.collide(players[0], obstacles[0], () => {
            this.playerHitObstacle(0)
        })
        this.physics.collide(players[0], obstacles[1], () => {
            this.playerHitObstacle(0)
        })
        this.physics.collide(players[1], obstacles[2], () => {
            this.playerHitObstacle(1)
        })
        this.physics.collide(players[1], obstacles[3], () => {
            this.playerHitObstacle(1)
        })
        this.physics.collide(players[2], obstacles[4], () => {
            this.playerHitObstacle(2)
        })
        this.physics.collide(players[2], obstacles[5], () => {
            this.playerHitObstacle(2)
        })
        this.physics.collide(players[3], obstacles[6], () => {
            this.playerHitObstacle(3)
        })
        this.physics.collide(players[3], obstacles[7], () => {
            this.playerHitObstacle(3)
        })
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

    isGameOver() {
        playerFinished.forEach(isFinished => {
            if (!isFinished) {
                return false
            }
        })
        return true
    }

    obstacleRemoved(obstacleIndex: number, playerIndex: number) {
        obstacles[obstacleIndex].destroy()
        moveplayers[playerIndex] = true
    }
}

export default MainScene
