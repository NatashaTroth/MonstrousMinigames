import 'reflect-metadata';

import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;

describe('Handle taking photo', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call sendPhotosToScreen when countdown is over', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'sendPhotosToScreen').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree['countdownTimeLeft'] = 0;
        gameThree['handleTakingPhoto']();
        expect(spy).toBeCalledTimes(1);
    });
});

describe('Handle received photo', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.todo('handleReceivedPhoto');
});

// private handleReceivedPhoto(message: IMessagePhoto) {
//     const player = this.players.get(message.userId!);
//     if (player && !player.roundInfo[this.roundIdx].received) player.receivedPhoto(message.url, this.roundIdx);

//     if (this.allPhotosReceived()) {
//         this.handleAllPhotosReceived();
//         //Do something
//     }
// }

describe('All photos received', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when all photos are received', async () => {
        Array.from(gameThree.players.values()).forEach(player => {
            player.roundInfo[gameThree['roundIdx']].received = true;
        });
        expect(gameThree['allPhotosReceived']()).toBeTruthy();
    });

    it('should return false when not all photos are received', async () => {
        Array.from(gameThree.players.values()).forEach(player => {
            player.roundInfo[gameThree['roundIdx']].received = true;
        });

        gameThree.players.get(users[0].id)!.roundInfo[gameThree['roundIdx']].received = false;
        expect(gameThree['allPhotosReceived']()).toBeFalsy();
    });
});

describe('Send Photos to screen', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.todo('sendPhotosToScreen');
});

// private sendPhotosToScreen() {
//     const photoUrls: photoPhotographerMapper[] = Array.from(this.players.values())
//         .filter(player => player.roundInfo[this.roundIdx].url)
//         .map(player => {
//             return { photographerId: player.id, url: player.roundInfo[this.roundIdx].url };
//         });

//     this.initiateCountdown(this.countdownTimeVote);
//     this.gameThreeGameState = GameThreeGameState.Voting;
//     GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, this.countdownTimeVote);
// }
