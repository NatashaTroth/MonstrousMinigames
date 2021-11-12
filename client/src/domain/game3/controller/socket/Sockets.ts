import { FinalPhoto, Vote, VoteResult } from "../../../../contexts/game3/Game3ContextProvider";
import {
    controllerGame3Route, controllerPresentRoute, controllerVoteRoute
} from "../../../../utils/routes";
import history from "../../../history/history";
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

export interface HandleSetSocket3ControllerDependencies {
    setVoteForPhotoMessage: (val: Vote) => void;
    setRoundIdx: (roundIdx: number) => void;
    setVotingResults: (val: VoteResult) => void;
    setPresentFinalPhotos: (val: FinalPhoto) => void;
}

export function handleSetControllerSocketGame3(socket: Socket, dependencies: HandleSetSocket3ControllerDependencies) {
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);
    const voteForFinalPhotosSocket = new MessageSocket(voteForFinalPhotosMessageTypeGuard, socket);
    const newRoundSocket = new MessageSocket(newRoundTypeGuard, socket);
    const presentFinalPhotosSocket = new MessageSocket(presentFinalPhotosTypeGuard, socket);

    const { setVoteForPhotoMessage, setRoundIdx, setVotingResults, setPresentFinalPhotos } = dependencies;

    newRoundSocket.listen((data: NewRoundMessage) => {
        setRoundIdx(data.roundIdx + 1);
        setVotingResults(undefined);
        setVoteForPhotoMessage(undefined);
        history.push(controllerGame3Route(data.roomId));
    });

    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
        setVoteForPhotoMessage({ photoUrls: data.photoUrls, countdownTime: data.countdownTime });
        history.push(controllerVoteRoute(data.roomId));
    });

    voteForFinalPhotosSocket.listen((data: VoteForFinalPhotosMessage) => {
        setVoteForPhotoMessage({ photographers: data.photographers, countdownTime: data.countdownTime });
        history.push(controllerVoteRoute(data.roomId));
    });

    presentFinalPhotosSocket.listen((data: PresentFinalPhotosMessage) => {
        setPresentFinalPhotos({
            photographerId: data.photographerId,
            name: data.name,
            photoUrls: data.photoUrls,
            countdownTime: data.countdownTime,
        });
        history.push(controllerPresentRoute(data.roomId));
    });
}
