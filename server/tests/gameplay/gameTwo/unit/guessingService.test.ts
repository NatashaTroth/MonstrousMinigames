import User from "../../../../src/classes/user";
import GuessingService from "../../../../src/gameplay/gameTwo/classes/GuessingServices";
import Parameters from "../../../../src/gameplay/gameTwo/constants/Parameters";
import { GuessHints } from "../../../../src/gameplay/gameTwo/enums/GuessHints";

const user = new User('ABCD', '72374', 'Franz', 1, '1');


let guessingService: GuessingService;
describe('GuessingService Tests', () => {
    beforeEach(() => {
        guessingService = new GuessingService(3);
        guessingService.init([user]);
    });

    it('should have an entry in guesses for the userId after init', () => {
        expect(guessingService.guesses.get(user.id)).not.toBeUndefined();
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
        const goodThreshold = Parameters.GOOD_GUESS_THRESHOLD;
        const badThreshold = Parameters.BAD_GUESS_THRESHOLD;

        expect(guessingService.getHint(goodThreshold)).toEqual(GuessHints.BIT_LOW);
        expect(guessingService.getHint(goodThreshold + 1)).toEqual(GuessHints.LOW);
        expect(guessingService.getHint(badThreshold + 1)).toEqual(GuessHints.VERY_LOW);
        expect(guessingService.getHint(goodThreshold * -1)).toEqual(GuessHints.BIT_HIGH);
        expect(guessingService.getHint(goodThreshold * -1 - 1)).toEqual(GuessHints.HIGH);
        expect(guessingService.getHint(badThreshold * -1)).toEqual(GuessHints.VERY_HIGH);
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

    it('should return a PlayerRank', () => {
        for (let i = 1; i < 4; i++) {
            guessingService.addGuess(i, 10, user.id);
            guessingService.saveSheepCount(i, 10);
        }
        const response = [
            {
                id: user.id,
                name: user.name,
                rank: 0,
                isActive: user.active,
                points: 0,
                previousRank: null,
                finishedRank: true
            }
        ];
        expect(guessingService.getPlayerRanks()).toEqual(response);

    });
    it('should return the right ranks after guessing and calculating', () => {
        guessingService = new GuessingService(3);
        const user2 = new User('ABCD', '23434', 'Maria', 2, '2');
        guessingService.init([user, user2]);

        guessingService.addGuess(1, 10, user.id);
        guessingService.addGuess(1, 19, user2.id);

        guessingService.saveSheepCount(1, 10);
        guessingService.calculatePlayerRanks();

        const response = [
            {
                id: user.id,
                name: user.name,
                rank: 1,
                isActive: user.active,
                points: 3,
                previousRank: 0,
                finishedRank: true
            },
            {
                id: user2.id,
                name: user2.name,
                rank: 2,
                isActive: user2.active,
                points: 2,
                previousRank: 0,
                finishedRank: true
            }
        ];
        expect(guessingService.getPlayerRanks()).toEqual(response);

    });

    it('should have 2 second ranks if two guesses have the same difference', () => {
        guessingService = new GuessingService(3);
        const user2 = new User('ABCD', '23434', 'Maria', 2, '2');
        const user3 = new User('ABCD', '234312', 'Peter', 3, '3');
        guessingService.init([user, user2, user3]);

        guessingService.addGuess(1, 10, user.id);
        guessingService.addGuess(1, 19, user2.id);
        guessingService.addGuess(1, 1, user3.id);

        guessingService.saveSheepCount(1, 10);
        guessingService.calculatePlayerRanks();

        const response = [
            {
                id: user.id,
                name: user.name,
                rank: 1,
                isActive: user.active,
                points: 3,
                previousRank: 0,
                finishedRank: true
            },
            {
                id: user2.id,
                name: user2.name,
                rank: 2,
                isActive: user2.active,
                points: 2,
                previousRank: 0,
                finishedRank: true
            },
            {
                id: user3.id,
                name: user3.name,
                rank: 2,
                isActive: user3.active,
                points: 2,
                previousRank: 0,
                finishedRank: true
            }
        ];
        expect(guessingService.getPlayerRanks()).toEqual(response);
    });


    it('should have the right amount of points after 3 rounds of guessing', () => {
        guessingService = new GuessingService(3);
        const user2 = new User('ABCD', '23434', 'Maria', 2, '2');
        const user3 = new User('ABCD', '234312', 'Peter', 3, '3');
        guessingService.init([user, user2, user3]);

        guessingService.addGuess(1, 10, user.id);
        guessingService.addGuess(1, 19, user2.id);
        guessingService.addGuess(1, 1, user3.id);

        guessingService.saveSheepCount(1, 10);
        guessingService.calculatePlayerRanks();

        guessingService.addGuess(2, 9, user.id);
        guessingService.addGuess(2, 20, user2.id);
        guessingService.addGuess(2, 1, user3.id);

        guessingService.saveSheepCount(2, 9);
        guessingService.calculatePlayerRanks();

        guessingService.addGuess(3, 8, user.id);
        guessingService.addGuess(3, 7, user2.id);
        guessingService.addGuess(3, 2, user3.id);

        guessingService.saveSheepCount(3, 8);
        guessingService.calculatePlayerRanks();

        const response = [
            {
                id: user.id,
                name: user.name,
                rank: 1,
                isActive: user.active,
                points: 9,
                previousRank: 1,
                finishedRank: true
            },
            {
                id: user2.id,
                name: user2.name,
                rank: 2,
                isActive: user2.active,
                points: 5,
                previousRank: 3,
                finishedRank: true
            },
            {
                id: user3.id,
                name: user3.name,
                rank: 2,
                isActive: user3.active,
                points: 5,
                previousRank: 2,
                finishedRank: true
            }
        ];
        expect(guessingService.getPlayerRanks()).toEqual(response);
    });

    it('allGuessesSubmitted() should return true if every user submitted a guess in the round', () => {
        guessingService = new GuessingService(3);
        const user2 = new User('ABCD', '23434', 'Maria', 2, '2');
        guessingService.init([user, user2]);

        guessingService.addGuess(1, 10, user.id);
        guessingService.addGuess(1, 19, user2.id);

        expect(guessingService.allGuessesSubmitted(1)).toBeTruthy();
    });

    it('allGuessesSubmitted() should return false if not every user submitted a guess in the round', () => {
        guessingService = new GuessingService(3);
        const user2 = new User('ABCD', '23434', 'Maria', 2, '2');
        guessingService.init([user, user2]);

        guessingService.addGuess(1, 10, user.id);

        expect(guessingService.allGuessesSubmitted(1)).toBeFalsy();
    });



});