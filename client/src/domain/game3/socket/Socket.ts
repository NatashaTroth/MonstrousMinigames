import { Topic, Vote, VoteResult } from "../../../contexts/game3/Game3ContextProvider";
import { MessageSocket } from "../../socket/MessageSocket";
import { Socket } from "../../socket/Socket";
import {
    FinalRoundCountdownMessage, finalRoundCountdownTypeGuard
} from "../../typeGuards/game3/finalRoundCountdown";
import { NewPhotoTopicMessage, newPhotoTopicTypeGuard } from "../../typeGuards/game3/newPhotoTopic";
import { VotingResultsMessage, votingResultsTypeGuard } from "../../typeGuards/game3/votingResults";

export interface HandleSetSocket3ControllerDependencies {
    setVoteForPhotoMessage: (val: Vote) => void;
    setTopicMessage: (props: Topic) => void;
    setFinalRoundCountdownTime: (time: number) => void;
    setVotingResults: (val: VoteResult) => void;
}

export function handleSetCommonSocketsGame3(socket: Socket, dependencies: HandleSetSocket3ControllerDependencies) {
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);
    const finalRoundCountdownSocket = new MessageSocket(finalRoundCountdownTypeGuard, socket);
    const votingResultsSocket = new MessageSocket(votingResultsTypeGuard, socket);

    const { setTopicMessage, setFinalRoundCountdownTime, setVotingResults } = dependencies;

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        setTopicMessage({ topic: data.topic, countdownTime: data.countdownTime });
    });

    votingResultsSocket.listen((data: VotingResultsMessage) => {
        setVotingResults({ results: data.results, countdownTime: data.countdownTime });
    });

    finalRoundCountdownSocket.listen((data: FinalRoundCountdownMessage) => {
        setFinalRoundCountdownTime(data.countdownTime);
    });
}
