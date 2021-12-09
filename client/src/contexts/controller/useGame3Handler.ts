import { useFinalRoundCountdownHandler } from '../../domain/game3/controller/gameState/finalRoundCountdownHandler';
import { useNewRoundHandler } from '../../domain/game3/controller/gameState/newRoundHandler';
import { usePresentFinalPhotosHandler } from '../../domain/game3/controller/gameState/presentFinalPhotosHandler';
import { useTopicHandler } from '../../domain/game3/controller/gameState/topicHandler';
import { useVoteForFinalPhotosHandler } from '../../domain/game3/controller/gameState/voteForFinalPhotosHandler';
import { useVoteForPhotoHandler } from '../../domain/game3/controller/gameState/voteForPhotoHandler';
import { useVotingResultsHandler } from '../../domain/game3/controller/gameState/votingResultsHandler';
import { Socket } from '../../domain/socket/Socket';

export const useGame3Handler = (socket: Socket) => {
    useVoteForPhotoHandler(socket);
    useNewRoundHandler(socket);
    useTopicHandler(socket);
    useVotingResultsHandler(socket);
    useFinalRoundCountdownHandler(socket);
    usePresentFinalPhotosHandler(socket);
    useVoteForFinalPhotosHandler(socket);
};
