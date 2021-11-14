import Sheep from "../../../src/gameplay/gameTwo/classes/Sheep";
import SheepService from "../../../src/gameplay/gameTwo/classes/SheepService";
import { SheepStates } from "../../../src/gameplay/gameTwo/enums/SheepStates";


let sheepService: SheepService;
describe('GameTwoPlyer Tests', () => {
    beforeEach(() => {
        sheepService = new SheepService(50);
    });

    it('the count of alive sheep is the same as the count of total sheep if all are alive', () => {
        expect(sheepService.getAliveSheepCount()).toEqual(sheepService.getSheep().length);
    });

    it('the count of alive sheep is 0 if all sheep are dead', () => {
        let newSheep = new Sheep(10,10,1);
        newSheep.state = SheepStates.DECOY;
        sheepService.sheep = [newSheep];
        expect(sheepService.getAliveSheepCount()).toEqual(0);
    });

});