
import { useFinalRoundCountdownHandler } from '../../domain/game3/controller/gameState/finalRoundCountdownHandler';
import { useTopicHandler } from '../../domain/game3/controller/gameState/topicHandler';
import { useVotingResultsHandler } from '../../domain/game3/controller/gameState/votingResultsHandler';
import { useNewRoundHandler } from '../../domain/game3/screen/gameState/newRoundHandler';
import { usePresentFinalPhotosHandler } from '../../domain/game3/screen/gameState/presentFinalPhotosHandler';
import { useVoteForFinalPhotosHandler } from '../../domain/game3/screen/gameState/voteForFinalPhotosHandler';
import { useVoteForPhotoHandler } from '../../domain/game3/screen/gameState/voteForPhotoHandler';
import { Socket } from '../../domain/socket/Socket';

export const useGame3Handler = (socket: Socket) => {
    useTopicHandler(socket);
    useVotingResultsHandler(socket);
    useFinalRoundCountdownHandler(socket);
    useNewRoundHandler(socket);
    useVoteForPhotoHandler(socket);
    useVoteForFinalPhotosHandler(socket);
    usePresentFinalPhotosHandler(socket);
};
