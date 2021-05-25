export function createBackground(
    addGameObjectFactory: Phaser.GameObjects.GameObjectFactory,
    windowWidth: number,
    windowHeight: number
) {
    const bg = addGameObjectFactory.image(windowWidth / 2, windowHeight / 2, 'forest');
    bg.setDisplaySize(windowWidth, windowHeight);
}
