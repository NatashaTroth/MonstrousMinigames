import GuessingService from "../../../src/gameplay/gameTwo/classes/GuessingServices";
import User from "../../../src/classes/user";
import { GuessHints } from "../../../src/gameplay/gameTwo/enums/GuessHints";
import InitialParameters from "../../../src/gameplay/gameTwo/constants/InitialParameters";

const user = new User('ABCD', 'socketId', 'name', 1, 'userId');


let guessingService: GuessingService;
describe('GuessingService Tests', () => {
    beforeEach(() => {
        guessingService = new GuessingService(3);
        guessingService.init([user]);
    });

    it('should have an entry in guesses for the userId after init', () => {
        expect(guessingService.guesses.get('userId')).not.toBeUndefined();
    });
    it('should return true after adding a guess to a user if no guess was added for the round before', () => {
        expect(guessingService.addGuess(1, 10, user.id)).toBeTruthy();
    });
    it('should return false on adding a guess that already exists', () => {
        guessingService.addGuess(1, 10, user.id);
        expect(guessingService.addGuess(1, 10, user.id)).toBeFalsy();
    });
    it('should return false on adding a guess if user does not exist', () => {
        expect(guessingService.addGuess(1, 10, 'gibberish')).toBeFalsy();
    });

    it('should return the right hint for the size of the miss', () => {
        const threshold = InitialParameters.GOOD_GUESS_THRESHOLD;
        expect(guessingService.getHint(threshold)).toEqual(GuessHints.LOW);
        expect(guessingService.getHint(threshold + 1)).toEqual(GuessHints.VERY_LOW);
        expect(guessingService.getHint(threshold * -1)).toEqual(GuessHints.HIGH);
        expect(guessingService.getHint(threshold * -1 - 1)).toEqual(GuessHints.VERY_HIGH);
        expect(guessingService.getHint(0)).toEqual(GuessHints.EXACT);
    });

    it('should return the exact hint if a user guesses right', () => {
        const round = 1;
        const sheepCount = 10;
        guessingService.saveSheepCount(round, sheepCount);
        guessingService.addGuess(1, sheepCount, user.id);
        expect(guessingService.getHintForRound(round, user.id)).toEqual(GuessHints.EXACT);
    });

    it('should return false if trying to save sheep count index is out of bound', () => {
        expect(guessingService.saveSheepCount(5, 10)).toBeFalsy();
    });

    it('should return false if trying to save sheep count index is already set for round', () => {
        guessingService.saveSheepCount(1, 11);
        expect(guessingService.saveSheepCount(1, 10)).toBeFalsy();
    });

    it('should return true if sheepcount is saved', () => {
        expect(guessingService.saveSheepCount(1, 10)).toBeTruthy();
    });

    it('should return the right saved sheep count', () => {
        const round = 1;
        const sheepCount = 10;
        guessingService.saveSheepCount(round, sheepCount);
        expect(guessingService.getCountForRound(round)).toEqual(sheepCount);
    });

    it('should return null if there is no saved count', () => {
        const round = 1;
        expect(guessingService.getCountForRound(round)).toEqual(null);
    });


});