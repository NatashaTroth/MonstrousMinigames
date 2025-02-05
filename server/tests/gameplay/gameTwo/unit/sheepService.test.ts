import Sheep from "../../../../src/gameplay/gameTwo/classes/Sheep";
import SheepService from "../../../../src/gameplay/gameTwo/classes/SheepService";
import { SheepStates } from "../../../../src/gameplay/gameTwo/enums/SheepStates";


let sheepService: SheepService;
describe('SheepService Tests', () => {
    beforeEach(() => {
        sheepService = new SheepService(50, 50);
    });

    it('the count of alive sheep is the same as the count of total sheep if all are alive', () => {
        sheepService.initSheep();
        expect(sheepService.getAliveSheepCount()).toEqual(50);
    });

    it('the count of alive sheep is the same as the count of total sheep if all are alive', () => {
        expect(sheepService.getAliveSheepCount()).toEqual(sheepService.sheep.length);
    });

    it('the count of alive sheep is 0 if all sheep are dead', () => {
        const newSheep = new Sheep(10, 10, 1);
        newSheep.state = SheepStates.DECOY;
        sheepService.sheep = [newSheep];
        expect(sheepService.getAliveSheepCount()).toEqual(0);
    });

});