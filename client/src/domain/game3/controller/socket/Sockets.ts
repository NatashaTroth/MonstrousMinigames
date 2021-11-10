import { controllerGame3Route, controllerVoteRoute } from "../../../../utils/routes";
import history from "../../../history/history";
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

export interface HandleSetSocket3ControllerDependencies {
    setVoteForPhotoMessage: (val: { photoUrls: PhotoUserMapper[]; countdownTime: number } | undefined) => void;
    setRoundIdx: (roundIdx: number) => void;
    setTopicMessage: (props: { topic: string; countdownTime: number } | undefined) => void;
    setCountdownTime: (time: number) => void;
    setVotingResults: (val: { results: VotingResult[]; countdownTime: number } | undefined) => void;
}

export function handleSetControllerSocketGame3(socket: Socket, dependencies: HandleSetSocket3ControllerDependencies) {
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);
    const newRoundSocket = new MessageSocket(newRoundTypeGuard, socket);
    const finalRoundCountdownSocket = new MessageSocket(finalRoundCountdownTypeGuard, socket);
    const votingResultsSocket = new MessageSocket(votingResultsTypeGuard, socket);

    const { setTopicMessage, setVoteForPhotoMessage, setRoundIdx, setCountdownTime, setVotingResults } = dependencies;

    newRoundSocket.listen((data: NewRoundMessage) => {
        setRoundIdx(data.roundIdx);
        setVotingResults(undefined);
        setVoteForPhotoMessage(undefined);
        history.push(controllerGame3Route(data.roomId));
    });

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        setTopicMessage({ topic: data.topic, countdownTime: data.countdownTime });
    });

    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
        setVoteForPhotoMessage({ photoUrls: data.photoUrls, countdownTime: data.countdownTime });
        history.push(controllerVoteRoute(data.roomId));
    });

    finalRoundCountdownSocket.listen((data: FinalRoundCountdownMessage) => {
        setCountdownTime(data.countdownTime);
    });

    votingResultsSocket.listen((data: VotingResultsMessage) => {
        setVotingResults({ results: data.results, countdownTime: data.countdownTime });
    });
}
