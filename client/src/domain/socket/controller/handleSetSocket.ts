import { FinalPhoto, Topic, Vote, VoteResult } from "../../../contexts/game3/Game3ContextProvider";
import {
    HandlePlayerFinishedProps
} from "../../commonGameState/controller/handlePlayerFinishedMessage";
import { HandlePlayerDiedProps } from "../../game1/controller/gameState/handlePlayerDied";
import { handleSetControllerSocketGame1 } from "../../game1/controller/socket/Sockets";
import { handleSetControllerSocketGame3 } from "../../game3/controller/socket/Sockets";
import { handleSetCommonSocketsGame3 } from "../../game3/socket/Socket";
import { Socket } from "../../socket/Socket";
import {
    ApproachingSolvableObstacleMessage
} from "../../typeGuards/game1/approachingSolvableObstacleTypeGuard";
import { StunnablePlayersMessage } from "../../typeGuards/game1/stunnablePlayers";

export interface HandleSetSocketDependencies {
    setExceededChaserPushes: (val: boolean) => void;
    setVoteForPhotoMessage: (val: Vote) => void;
    setRoundIdx: (roundIdx: number) => void;
    setTopicMessage: (val: Topic) => void;
    setVotingResults: (val: VoteResult) => void;
    setFinalRoundCountdownTime: (time: number) => void;
    setPresentFinalPhotos: (val: FinalPhoto) => void;
    handlePlayerFinishedMessage: (data: HandlePlayerFinishedProps) => void;
    handleStunnablePlayers: (data: StunnablePlayersMessage) => void;
    handlePlayerDied: (data: HandlePlayerDiedProps) => void;
    handleApproachingObstacleMessage: (data: ApproachingSolvableObstacleMessage) => void;
}

export function handleSetSocket(
    socket: Socket,
    roomId: string,
    playerFinished: boolean,
    dependencies: HandleSetSocketDependencies
) {
    const {
        setVoteForPhotoMessage,
        setRoundIdx,
        setTopicMessage,
        setVotingResults,
        setFinalRoundCountdownTime,
        setPresentFinalPhotos,
    } = dependencies;

    handleSetControllerSocketGame1(socket, roomId, playerFinished, dependencies);

    handleSetCommonSocketsGame3(socket, {
        setTopicMessage,
        setVoteForPhotoMessage,
        setFinalRoundCountdownTime,
        setVotingResults,
    });
    handleSetControllerSocketGame3(socket, {
        setVoteForPhotoMessage,
        setRoundIdx,
        setVotingResults,
        setPresentFinalPhotos,
    });
}
