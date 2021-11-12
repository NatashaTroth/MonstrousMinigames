import { FinalPhoto, Vote, VoteResult } from "../../../../contexts/game3/Game3ContextProvider";
import { MessageSocket } from "../../../socket/MessageSocket";
import { Socket } from "../../../socket/Socket";
import { NewRoundMessage, newRoundTypeGuard } from "../../../typeGuards/game3/newRound";
import {
    PresentFinalPhotosMessage, presentFinalPhotosTypeGuard
} from "../../../typeGuards/game3/presentFinalPhotos";
import {
    VoteForFinalPhotosMessage, voteForFinalPhotosMessageTypeGuard
} from "../../../typeGuards/game3/voteForFinalPhotos";
import {
    VoteForPhotoMessage, voteForPhotoMessageTypeGuard
} from "../../../typeGuards/game3/voteForPhotos";

export interface HandleSetSocket3Dependencies {
    setRoundIdx: (roundIdx: number) => void;
    setVoteForPhotoMessage: (val: Vote) => void;
    setVotingResults: (val: VoteResult) => void;
    setPresentFinalPhotos: (val: FinalPhoto) => void;
}

export function handleSetScreenSocketGame3(socket: Socket, dependencies: HandleSetSocket3Dependencies) {
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);
    const newRoundSocket = new MessageSocket(newRoundTypeGuard, socket);
    const presentFinalPhotosSocket = new MessageSocket(presentFinalPhotosTypeGuard, socket);
    const voteForFinalPhotosSocket = new MessageSocket(voteForFinalPhotosMessageTypeGuard, socket);

    const { setRoundIdx, setVoteForPhotoMessage, setVotingResults, setPresentFinalPhotos } = dependencies;

    newRoundSocket.listen((data: NewRoundMessage) => {
        setRoundIdx(data.roundIdx + 1);
        setVoteForPhotoMessage(undefined);
        setVotingResults(undefined);
    });

    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
        setVoteForPhotoMessage({ photoUrls: data.photoUrls, countdownTime: data.countdownTime });
    });

    voteForFinalPhotosSocket.listen((data: VoteForFinalPhotosMessage) => {
        setPresentFinalPhotos(undefined);
        setVoteForPhotoMessage({ photographers: data.photographers, countdownTime: data.countdownTime });
    });

    presentFinalPhotosSocket.listen((data: PresentFinalPhotosMessage) => {
        setPresentFinalPhotos({
            photographerId: data.photographerId,
            name: data.name,
            photoUrls: data.photoUrls,
            countdownTime: data.countdownTime,
        });
    });
}
