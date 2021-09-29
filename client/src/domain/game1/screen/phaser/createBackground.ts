export function createBackground(
    addGameObjectFactory: Phaser.GameObjects.GameObjectFactory,
    windowWidth: number,
    windowHeight: number
) {
    let x = 0;
    for (let i = 0; i < 3; i++) {
        const bg = addGameObjectFactory.image(windowWidth / 2 + x, windowHeight / 2, 'forest2');
        bg.setDisplaySize(windowWidth, windowHeight);
        bg.setOrigin(0, 1);
        bg.setScrollFactor(1);

        x = bg.width;
    }
}
