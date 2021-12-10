import GameTwoPlayer from "../../../../src/gameplay/gameTwo/GameTwoPlayer";
import { Direction } from "../../../../src/gameplay/gameTwo/enums/Direction";


let player: GameTwoPlayer;
describe('GameTwoPlyer Tests', () => {
    beforeEach(() => {
        player = new GameTwoPlayer('X', 'John', 1, 3, 1);
    });

    it('initial direction should be C', () => {
        expect(player.direction).toEqual('C');
    });

    it('should have the same position when moving with direction set to stop', () => {
        const initialPositionX = player.posX;
        const initialPositionY = player.posY;

        player.direction = Direction.STOP;
        player.move();
        player.move();

        expect(player.posX).toEqual(initialPositionX);
        expect(player.posY).toEqual(initialPositionY);
    });

    it('should have a y-pos lower 1 than the initial positon when moving up once', () => {
        const initialPositionY = player.posY;

        player.direction = Direction.UP;
        player.move();

        expect(player.posY).toEqual(initialPositionY - 1);
    });

    it('should have a y-pos higher 1 than the initial positon when moving down once', () => {
        const initialPositionY = player.posY;

        player.direction = Direction.DOWN;
        player.move();

        expect(player.posY).toEqual(initialPositionY + 1);
    });
    it('should have a x-pos lower 1 than the initial positon when moving left once', () => {
        const initialPositionX = player.posX;

        player.direction = Direction.LEFT;
        player.move();

        expect(player.posX).toEqual(initialPositionX - 1);
    });
    it('should have a x-pos higher 1 than the initial positon when moving right once', () => {
        const initialPositionX = player.posX;

        player.direction = Direction.RIGHT;
        player.move();

        expect(player.posX).toEqual(initialPositionX + 1);
    });

    it('should have higher x and y value on down-right movement', () => {
        const initialPositionX = player.posX;
        const initialPositionY = player.posY;

        player.direction = Direction.DOWN_RIGHT;
        player.move();

        expect(player.posX).toEqual(initialPositionX + 1);
        expect(player.posY).toEqual(initialPositionY + 1);
    });

    it('should have lower x and y value on up-left movement', () => {
        const initialPositionX = player.posX;
        const initialPositionY = player.posY;

        player.direction = Direction.UP_LEFT;
        player.move();

        expect(player.posX).toEqual(initialPositionX - 1);
        expect(player.posY).toEqual(initialPositionY - 1);
    });

    it('should have lower x and higher y value on down-left movement', () => {
        const initialPositionX = player.posX;
        const initialPositionY = player.posY;

        player.direction = Direction.DOWN_LEFT;
        player.move();

        expect(player.posX).toEqual(initialPositionX - 1);
        expect(player.posY).toEqual(initialPositionY + 1);
    });

    it('should have higher x and lower y value on up-right movement', () => {
        const initialPositionX = player.posX;
        const initialPositionY = player.posY;

        player.direction = Direction.UP_RIGHT;
        player.move();

        expect(player.posX).toEqual(initialPositionX + 1);
        expect(player.posY).toEqual(initialPositionY - 1);
    });

    it('should have the initial position after setting player position', () => {
        const initialPositionX = player.posX;
        const initialPositionY = player.posY;

        player.direction = Direction.UP_RIGHT;
        player.move();
        player.move();

        player.setPlayerPosition();

        expect(player.posX).toEqual(initialPositionX);
        expect(player.posY).toEqual(initialPositionY);
    });

});