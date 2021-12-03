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


});