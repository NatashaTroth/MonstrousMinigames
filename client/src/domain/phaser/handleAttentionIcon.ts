import { Player } from './gameInterfaces';

export function addAttentionIcon(playerIndex: number, players: Player[], physics: Phaser.Physics.Arcade.ArcadePhysics) {
    if (!players[playerIndex].playerAttention) {
        players[playerIndex].playerAttention = physics.add
            .sprite(players[playerIndex].phaserObject.x + 75, players[playerIndex].phaserObject.y - 150, 'attention')
            .setDepth(100)
            .setScale(0.03, 0.03);
    }
}

export function destroyAttentionIcon(playerIndex: number, players: Player[]) {
    players[playerIndex].playerAttention?.destroy();
    players[playerIndex].playerAttention = null;
}
