export interface Player {
    phaserObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    playerRunning: boolean;
    playerAtObstacle: boolean;
    playerObstacles: Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>;
    playerCountSameDistance: number;
    playerAttention: null | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; //TODO change
    playerText: Phaser.GameObjects.Text;
}
