import { FinalPhoto, Topic, Vote } from '../../../contexts/game3/Game3ContextProvider';
import { getTime } from '../../../domain/game3/screen/components/Game3';

describe('getTime', () => {
    const presentFinalPhotos: FinalPhoto = { photographerId: '1', countdownTime: 4000, photoUrls: [], name: 'mock' };
    const finalRoundCountdownTime: number | undefined = 10;
    const voteForPhotoMessage: Vote = { countdownTime: 3000 };
    const topicMessage: Topic = { countdownTime: 2000, topic: 'random' };

    it('should return undefined if no time is given', () => {
        const time = getTime(undefined, undefined, undefined, undefined);
        expect(time).toEqual(undefined);
    });

    it('should return voteForPhotoMessage time first', () => {
        const time = getTime(presentFinalPhotos, finalRoundCountdownTime, voteForPhotoMessage, topicMessage);
        expect(time).toEqual(voteForPhotoMessage.countdownTime);
    });

    it('should return presentFinalPhotos time if no voteForPhotMessage is given', () => {
        const time = getTime(presentFinalPhotos, finalRoundCountdownTime, undefined, topicMessage);
        expect(time).toEqual(presentFinalPhotos.countdownTime);
    });

    it('should return finalRoundCountdownTime if no voteForPhotMessage or presentFinalPhotos is given', () => {
        const time = getTime(undefined, finalRoundCountdownTime, undefined, topicMessage);
        expect(time).toEqual(finalRoundCountdownTime);
    });

    it('should return topicMessageCountdown if no other props are given', () => {
        const time = getTime(undefined, undefined, undefined, topicMessage);
        expect(time).toEqual(topicMessage.countdownTime);
    });
});
