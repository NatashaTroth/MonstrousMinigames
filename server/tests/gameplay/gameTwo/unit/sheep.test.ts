import Sheep from "../../../../src/gameplay/gameTwo/classes/Sheep";
import Parameters from "../../../../src/gameplay/gameTwo/constants/Parameters";
import { SheepStates } from "../../../../src/gameplay/gameTwo/enums/SheepStates";

let sheep: Sheep;
describe('Sheep Tests', () => {
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

    it('stopMoving should return false if no timer is set', () => {
        expect(sheep.stopMoving()).toBeFalsy();
    });

    it('startMoving should return false if the sheep is not alive', () => {
        sheep.state = SheepStates.DECOY;
        expect(sheep.startMoving()).toBeFalsy();
    });

    it('startMoving should return false if the sheep is not alive', () => {
        sheep.state = SheepStates.DECOY;
        expect(sheep.startMoving()).toBeFalsy();
    });

    it('should not move if it would move outsideo of boundaries', () => {

        // left border
        sheep.posX = 0;
        sheep.isMoving = true;
        sheep.direction = 'W';
        sheep.update();
        expect(sheep.posX).toEqual(0);

        // right border
        sheep.posX = Parameters.LENGTH_X;
        sheep.direction = 'E';
        sheep.update();
        expect(sheep.posX).toEqual(Parameters.LENGTH_X);

        // top border
        sheep.posY = 0;
        sheep.direction = 'N';
        sheep.update();
        expect(sheep.posY).toEqual(0);

        //bottom border
        sheep.posY = Parameters.LENGTH_Y;
        sheep.direction = 'S';
        sheep.update();
        expect(sheep.posY).toEqual(Parameters.LENGTH_Y);

    });

});