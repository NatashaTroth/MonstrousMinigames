import { Vote, VoteResult } from "../../../../contexts/game3/Game3ContextProvider";
import { MessageSocket } from "../../../socket/MessageSocket";
import { Socket } from "../../../socket/Socket";
import { NewRoundMessage, newRoundTypeGuard } from "../../../typeGuards/game3/newRound";
import {
    VoteForPhotoMessage, voteForPhotoMessageTypeGuard
} from "../../../typeGuards/game3/voteForPhotos";

export interface HandleSetSocket3Dependencies {
    setRoundIdx: (roundIdx: number) => void;
    setVoteForPhotoMessage: (val: Vote) => void;
    setVotingResults: (val: VoteResult) => void;
}

export function handleSetScreenSocketGame3(socket: Socket, dependencies: HandleSetSocket3Dependencies) {
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);
    const newRoundSocket = new MessageSocket(newRoundTypeGuard, socket);

    const { setRoundIdx, setVoteForPhotoMessage, setVotingResults } = dependencies;

    newRoundSocket.listen((data: NewRoundMessage) => {
        setRoundIdx(data.roundIdx + 1);
        setVoteForPhotoMessage(undefined);
        setVotingResults(undefined);
    });

    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
        setVoteForPhotoMessage({ photoUrls: data.photoUrls, countdownTime: data.countdownTime });
    });
}
