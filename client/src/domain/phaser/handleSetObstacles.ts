import { Obstacles } from '../../utils/constants';
import { ObstacleDetails } from './gameInterfaces';
import { mapServerPosToWindowPos } from './mapServerPosToWindowPos';

interface HandleSetObstacles {
    obstaclesDetails: ObstacleDetails[];
    posY: number;
    physics: Phaser.Physics.Arcade.ArcadePhysics;
    trackLength: number;
}
export function handleSetObstacles(props: HandleSetObstacles) {
    let phaserObstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    const { obstaclesDetails: obstaclesArray, posY, physics, trackLength } = props;
    const obstacles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];

    obstaclesArray.forEach((obstacle, index) => {
        const posX = mapServerPosToWindowPos(obstacle.positionX, trackLength) + 75;
        let obstaclePosY = posY + 30;
        let obstacleScale = 0.3;

        switch (obstacle.type) {
            case Obstacles.treeStump:
                obstaclePosY = posY + 45;
                obstacleScale = 0.4;
                break;
            case Obstacles.spider:
                obstaclePosY = posY + 25;
                obstacleScale = 0.2;
                break;
        }

        phaserObstacle = physics.add.sprite(posX, obstaclePosY, obstacle.type.toLowerCase());
        phaserObstacle.setScale(obstacleScale, obstacleScale);
        phaserObstacle.setDepth(obstaclesArray.length - index);
        obstacles.push(phaserObstacle);
    });

    return obstacles;
}
