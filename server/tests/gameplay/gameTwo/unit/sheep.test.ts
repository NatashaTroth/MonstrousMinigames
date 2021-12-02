import Sheep from "../../../../src/gameplay/gameTwo/classes/Sheep";

let sheep: Sheep;
describe('RoundService Tests', () => {
    beforeEach(() => {
        sheep = new Sheep(50, 50, 1);
    });

    it('it sheeps 🐑', () => {
        expect(sheep.initDirections().length).toEqual(40);
    });


});