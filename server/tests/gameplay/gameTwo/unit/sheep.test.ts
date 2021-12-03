import Sheep from "../../../../src/gameplay/gameTwo/classes/Sheep";
import Parameters from "../../../../src/gameplay/gameTwo/constants/Parameters";

let sheep: Sheep;
describe('RoundService Tests', () => {
    beforeEach(() => {
        sheep = new Sheep(50, 50, 1);
    });

    it('should have the right amount of directions in the begining', () => {
        expect(sheep.directions.length).toEqual(Parameters.SHEEP_DIRECTIONS_COUNT);
    });

    it('should have the right amount of directions after running out of directions', () => {
        for (let i = 0; i <= Parameters.SHEEP_DIRECTIONS_COUNT; i++) {
            sheep.setNewDirection()
        }
        expect(sheep.directions.length).toEqual(Parameters.SHEEP_DIRECTIONS_COUNT - 1);
    });

    it('should have less directions after moving', () => {
        jest.useFakeTimers();
        sheep.startMoving();

        jest.runTimersToTime(Parameters.SHEEP_FREEZE_MAX_MS * 5);
        sheep.stopMoving();

        expect(sheep.directions.length).toBeLessThan(Parameters.SHEEP_DIRECTIONS_COUNT);
    });

    it('should have the right amount of directions after running out of directions', () => {
        const initialPosX = sheep.posX;
        const initialPosY = sheep.posY;



        sheep.isMoving = true;
        sheep.direction = 'W';
        sheep.update();
        expect(sheep.posX).toBeLessThan(initialPosX);

        sheep.direction = 'E';
        sheep.update();
        expect(sheep.posX).toEqual(initialPosX);

        sheep.direction = 'N';
        sheep.update();
        expect(sheep.posY).toBeLessThan(initialPosY);

        sheep.direction = 'S';
        sheep.update();
        expect(sheep.posY).toEqual(initialPosY);

    });

    it('should return false if no timer is set', () => {
        expect(sheep.stopMoving()).toBeFalsy();
    });


});