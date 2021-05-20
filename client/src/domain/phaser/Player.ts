import { Obstacles } from '../../utils/constants';
import { GameData } from './gameInterfaces';
import { mapServerPosToWindowPos } from './mapServerPosToWindowPos';
import { Coordinates, PlayerRenderer } from './renderer/PlayerRenderer';

/**
 * This is the main player class where all the business functionality should be implemented (eg. what happens when a
 * player moves forward). This class should not depend on phaser itself (as phaser is hard to test), but should depend
 * on the replaceable interface (PlayerRenderer) which can be mocked. With the mocked interface in combination with
 * the InMemoryPlayerRenderer, testing this class should be pretty straight forward.
 */
export class Player {
    plusX = 40;
    plusY = 110;
    username: string;
    // name: string;
    animationName: string;
    // yPosition: number
    // phaserObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    playerRunning: boolean;
    playerAtObstacle: boolean;
    // playerObstacles: Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>
    // playerObstacles: Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>;
    // playerCountSameDistance: number
    playerAttention: null | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; //TODO change
    // playerText: Phaser.GameObjects.Text
    phaserObject: any; //TODO DELETE
    playerCountSameDistance: number;

    constructor(
        public renderer: PlayerRenderer, // TODO MAKE PRIVATE
        private index: number,
        private coordinates: Coordinates,
        private gameStateData: GameData,
        private monsterName: string
    ) {
        this.coordinates = {
            x: this.coordinates.x + this.plusX * this.index,
            y: this.coordinates.y + this.plusY * this.index,
        };

        this.animationName = `${monsterName}Walk`;
        this.username = gameStateData.playersState[index].name;
        this.phaserObject = {};
        this.playerRunning = false;
        this.playerAtObstacle = false;
        // this.playerObstacles = this.setObstacles();
        // this.playerObstacles = handleSetObstacles({
        //     this.obstaclesDetails = gameStateData.playersState[index].obstacles
        //     posY
        //     this.physics = PhaserInstance.physics
        //     this.trackLength = PhaserInstance.trackLength
        // }
        this.playerCountSameDistance = 0;
        this.playerAttention = null;

        this.renderPlayer();
        this.setObstacles();
    }

    moveForward(x: number) {
        // TODO ...
        // check if player can move forward (eg. no obstacle upfront)

        // update coordinates and rerender. In the test you can spy on the renderPlayer function and verify
        // that it was called with the correct and updated coordinates.
        this.coordinates = { ...this.coordinates, x: x };
        this.renderPlayer();
    }

    markPlayerAsFinished(): void {
        // TODO ...
    }

    finishObstacle(): void {
        // TODO ...
    }

    private renderPlayer() {
        this.renderer.renderPlayer(this.coordinates, this.monsterName, this.animationName);

        // TODO render player name
        // this.renderer.renderText(
        //     { x: this.coordinates.x, y: this.coordinates.y - 100 },
        //     'TODO', // data.data.playersState[i].name, // TODO,
        //     '#000000'
        // );
    }

    private setObstacles() {
        const obstaclesArray = this.gameStateData.playersState[this.index].obstacles;

        obstaclesArray.forEach((obstacle, index) => {
            const posX = mapServerPosToWindowPos(obstacle.positionX, this.gameStateData.trackLength) + 75;
            let obstaclePosY = this.coordinates.y + 30;
            let obstacleScale = 0.3;

            switch (obstacle.type) {
                case Obstacles.treeStump:
                    obstaclePosY = this.coordinates.y + 45;
                    obstacleScale = 0.4;
                    break;
                case Obstacles.spider:
                    obstaclePosY = this.coordinates.y + 25;
                    obstacleScale = 0.2;
                    break;
            }

            this.renderer.renderObstacles(
                posX,
                obstaclePosY,
                obstacleScale,
                obstacle.type.toLowerCase(),
                obstaclesArray.length - index
            );
        });
    }

    private startRunningAnimation() {
        this.renderer.startRunningAnimation(this.animationName);
        this.playerRunning = true;
    }

    private stopRunningAnimation() {
        this.renderer.stopRunningAnimation();
        this.playerRunning = false;
    }
}
