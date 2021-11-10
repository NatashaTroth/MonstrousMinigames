import { MessageSocket } from "../../../socket/MessageSocket";
import { Socket } from "../../../socket/Socket";
import {
    FinalRoundCountdownMessage, finalRoundCountdownTypeGuard
} from "../../../typeGuards/game3/finalRoundCountdown";
import {
    NewPhotoTopicMessage, newPhotoTopicTypeGuard
} from "../../../typeGuards/game3/newPhotoTopic";
import { NewRoundMessage, newRoundTypeGuard } from "../../../typeGuards/game3/newRound";
import {
    PhotoUserMapper, VoteForPhotoMessage, voteForPhotoMessageTypeGuard
} from "../../../typeGuards/game3/voteForPhotos";
import {
    VotingResult, VotingResultsMessage, votingResultsTypeGuard
} from "../../../typeGuards/game3/votingResults";

export interface HandleSetSocket3Dependencies {
    setTopicMessage: (val: { topic: string; countdownTime: number } | undefined) => void;
    setRoundIdx: (roundIdx: number) => void;
    setVoteForPhotoMessage: (val: { photoUrls: PhotoUserMapper[]; countdownTime: number } | undefined) => void;
    setFinalRoundCountdownTime: (time: number) => void;
    setVotingResults: (val: { results: VotingResult[]; countdownTime: number } | undefined) => void;
}

// TODO check if it could be refactored
export function handleSetScreenSocketGame3(socket: Socket, dependencies: HandleSetSocket3Dependencies) {
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);
    const newRoundSocket = new MessageSocket(newRoundTypeGuard, socket);
    const finalRoundCountdownSocket = new MessageSocket(finalRoundCountdownTypeGuard, socket);
    const votingResultsSocket = new MessageSocket(votingResultsTypeGuard, socket);

    const {
        setTopicMessage,
        setRoundIdx,
        setVoteForPhotoMessage,
        setFinalRoundCountdownTime,
        setVotingResults,
    } = dependencies;

    newRoundSocket.listen((data: NewRoundMessage) => {
        setRoundIdx(data.roundIdx);
        setVoteForPhotoMessage(undefined);
    });

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        setTopicMessage({ topic: data.topic, countdownTime: data.countdownTime });
    });

    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
        setVoteForPhotoMessage({ photoUrls: data.photoUrls, countdownTime: data.countdownTime });
    });

    finalRoundCountdownSocket.listen((data: FinalRoundCountdownMessage) => {
        setFinalRoundCountdownTime(data.countdownTime);
    });

    votingResultsSocket.listen((data: VotingResultsMessage) => {
        setVotingResults({ results: data.results, countdownTime: data.countdownTime });
    });
}
