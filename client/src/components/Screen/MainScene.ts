import Phaser from 'phaser'

import forest from '../../images/forest.png'
import franz from '../../images/franz_spritesheet.png'
import goal from '../../images/goal.png'
import monster2 from '../../images/monster2.png'
import noah from "../../images/noah_spritesheet.png"
import steffi from "../../images/steffi_spritesheet.png"
import susi from "../../images/susi_spritesheet.png"
import unicorn from '../../images/unicorn.png'
import wood from '../../images/wood.png'

const players: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
const goals: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
const obstacles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = []
const moveplayers = [true, true, true, true]
const playerFinished = [false, false, false, false]

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }

    preload(): void {
        this.load.spritesheet('franz', franz, { frameWidth: 826, frameHeight: 1163});
        this.load.spritesheet('susi', susi, { frameWidth: 826, frameHeight: 1163});
        this.load.spritesheet('noah', noah, { frameWidth: 826, frameHeight: 1163});
        this.load.spritesheet('steffi', steffi, { frameWidth: 826, frameHeight: 1163});

        this.load.image('monster2', monster2)
        this.load.image('monster', '../../images/monster.png')
        this.load.image('unicorn', unicorn)
        this.load.image('forest', forest)
        this.load.image('goal', goal)
        this.load.image('wood', wood)
    }

    create() {
        const forest = this.add.image(0, 0, 'forest')
        const player1 = this.physics.add.sprite(10, 10, 'franz')
        const player2 = this.physics.add.sprite(68, 300, 'susi')
        const player3 = this.physics.add.sprite(68, 500, 'noah')
        const player4 = this.physics.add.sprite(68, 700, 'steffi')
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
            player.setScale(0.2, 0.2)
            player.setCollideWorldBounds(true)
        })

        forest.setScale(1.2, 1.4)
        goal1.setScale(0.1, 0.1)
        goal2.setScale(0.1, 0.1)
        goal3.setScale(0.1, 0.1)
        goal4.setScale(0.1, 0.1)

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
        
        
        /* players.forEach(player => {
            player.anims.play('right');
        }); */
        players[0].anims.play('franzWalk')
        players[1].anims.play('susiWalk')
        players[2].anims.play('noahWalk')
        players[3].anims.play('steffiWalk')
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
