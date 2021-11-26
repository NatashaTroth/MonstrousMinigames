import 'reflect-metadata';

import { Votes } from '../../../../src/gameplay/gameThree/classes/Votes';
import { users } from '../../mockData';

let votes: Votes;

describe('Get number of votes', () => {
    beforeEach(() => {
        votes = new Votes();
    });

    it('should return 0 when no photos have been received', () => {
        expect(votes.getNumberVotes(users[1].id)).toBe(0);
    });

    it('should return 1 when a photo has been received', () => {
        votes.addVote(users[0].id, users[1].id);
        expect(votes.getNumberVotes(users[1].id)).toBe(1);
    });

    it('should return 2 when a photo has been received', () => {
        votes.addVote(users[0].id, users[1].id);
        votes.addVote(users[2].id, users[1].id);
        expect(votes.getNumberVotes(users[1].id)).toBe(2);
    });

    it('should not be able to vote for yourself', () => {
        votes.addVote(users[0].id, users[0].id);
        expect(votes.getNumberVotes(users[0].id)).toBe(0);
    });

    it('should not be able to vote twice', () => {
        votes.addVote(users[0].id, users[1].id);
        votes.addVote(users[0].id, users[1].id);
        expect(votes.getNumberVotes(users[1].id)).toBe(1);
    });
});

describe('Get all votes', () => {
    beforeEach(() => {
        votes = new Votes();
    });

    it('should return an empty array when no votes have been added', () => {
        expect(votes.getAllVotes().length).toBe(0);
    });

    it('should return an added vote to correct photographer', () => {
        votes.addVote(users[0].id, users[1].id);
        expect(votes.getAllVotes()[0].photographerId).toBe(users[1].id);
    });

    it('should return an added vote with number of votes as 1', () => {
        votes.addVote(users[0].id, users[1].id);
        expect(votes.getAllVotes()[0].votes).toBe(1);
    });

    it('should return a second added vote to correct photographer', () => {
        votes.addVote(users[0].id, users[1].id);
        votes.addVote(users[1].id, users[2].id);
        expect(votes.getAllVotes()[1].photographerId).toBe(users[2].id);
    });

    it('should return correct photographer with multiple votes', () => {
        votes.addVote(users[0].id, users[1].id);
        votes.addVote(users[2].id, users[1].id);
        expect(votes.getAllVotes()[0].photographerId).toBe(users[1].id);
    });

    it('should return correct number of votes with multiple votes', () => {
        votes.addVote(users[0].id, users[1].id);
        votes.addVote(users[2].id, users[1].id);
        expect(votes.getAllVotes()[0].votes).toBe(2);
    });
});

describe('Has voted', () => {
    beforeEach(() => {
        votes = new Votes();
    });

    it('should return false when a user has not voted', () => {
        expect(votes.hasVoted(users[0].id)).toBeFalsy();
    });

    it('should return false when a user has not voted', () => {
        votes.addVote(users[0].id, users[1].id);
        expect(votes.hasVoted(users[0].id)).toBeTruthy();
    });

    it('should return false when a user votes for themselves', () => {
        votes.addVote(users[0].id, users[0].id);
        expect(votes.hasVoted(users[0].id)).toBeFalsy();
    });
});

describe('Have Votes from all Users', () => {
    beforeEach(() => {
        votes = new Votes();
    });

    it('should return false when no photos have been received', () => {
        expect(votes.haveVotesFromAllUsers(users.map(user => user.id))).toBeFalsy();
    });

    it('should return false when not all photos have been received', () => {
        votes.addVote(users[0].id, users[1].id);
        expect(votes.haveVotesFromAllUsers(users.map(user => user.id))).toBeFalsy();
    });

    it('should return truthy when photos have been received', () => {
        users.forEach((user, idx) => {
            votes.addVote(user.id, users[(idx + 1) % users.length].id);
        });
        expect(votes.haveVotesFromAllUsers(users.map(user => user.id))).toBeTruthy();
    });
});

describe('Get Voter Ids', () => {
    beforeEach(() => {
        votes = new Votes();
    });

    it('should return empty array when a user has not voted', () => {
        expect(votes.getVoterIds().length).toBe(0);
    });

    it('should return empty array when a user votes for themselves', () => {
        votes.addVote(users[0].id, users[0].id);
        expect(votes.getVoterIds().length).toBe(0);
    });

    it('should return one id', () => {
        votes.addVote(users[0].id, users[1].id);
        expect(votes.getVoterIds().length).toBe(1);
    });

    it('should return users[0] id', () => {
        votes.addVote(users[0].id, users[1].id);
        expect(votes.getVoterIds()[0]).toBe(users[0].id);
    });

    it('should return one id, when a user votes twice', () => {
        votes.addVote(users[0].id, users[1].id);
        votes.addVote(users[0].id, users[2].id);
        expect(votes.getVoterIds().length).toBe(1);
    });

    it('should return two ids', () => {
        votes.addVote(users[0].id, users[1].id);
        votes.addVote(users[1].id, users[2].id);
        expect(votes.getVoterIds().length).toBe(2);
    });

    it('should return users[1] id as the second id', () => {
        votes.addVote(users[0].id, users[1].id);
        votes.addVote(users[1].id, users[2].id);
        expect(votes.getVoterIds()[1]).toBe(users[1].id);
    });
});
