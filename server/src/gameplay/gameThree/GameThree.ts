import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
import { GameState } from '../enums';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import { Countdown } from './classes/Countdown';
import { PhotoTopics } from './classes/PhotoTopics';
import { PresentationController } from './classes/PresentationController';
import { StageController } from './classes/StageController';
import InitialParameters from './constants/InitialParameters';
import { GameThreeGameState } from './enums/GameState';
import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreeEventEmitter from './GameThreeEventEmitter';
// import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreePlayer from './GameThreePlayer';
import {
    GameStateInfo, IMessagePhoto, IMessagePhotoVote, PlayerNameId, votingResultsPhotographerMapper
} from './interfaces';
import { GameThreePlayerRank } from './interfaces/GameThreePlayerRank';

type GameThreeGameInterface = IGameInterface<GameThreePlayer, GameStateInfo>;

//Object calisthenics
//God object anti pattern
//welche daten gehören zusammen - countdown objekt - hat eigene update methode - wenn was keine überschneidung dann rausziehen
//tdd as if you meant it
// extract class refactoring martin fowler
export default class GameThree extends Game<GameThreePlayer, GameStateInfo> implements GameThreeGameInterface {
    // TODO set in create new game so workds for reset
    private stageController?: StageController;
    private countdown?: Countdown; //TODO move to stage controller
    public photoTopics?: PhotoTopics;
    // private roundIdx = -1;
    // private playerPresentOrder: string[] = [];
    private presentationController?: PresentationController;
    gameName = GameNames.GAME3;

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
        this.sendGameStateUpdates = false;
    }

    getGameStateInfo(): GameStateInfo {
        //TODO do i need to send this? think not
        return {
            gameState: this.gameState,
            roomId: this.roomId,
        };
    }

    protected beforeCreateNewGame() {
        return;
    }

    protected mapUserToPlayer(user: User): GameThreePlayer {
        const player = new GameThreePlayer(user.id, user.name, user.characterNumber);

        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        this.countdown?.update(timeElapsedSinceLastFrame);
    }

    // *** Round Change ***

    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        //TODO
    }

    createNewGame(users: Array<User>) {
        super.createNewGame(users);
        this.stageController = new StageController(this);
        this.countdown = new Countdown(this.stageController);
        this.photoTopics = new PhotoTopics();
        this.presentationController = new PresentationController(
            Array.from(this.players.values()).map(player => player.id)
        );
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
        }, InitialParameters.COUNTDOWN_TIME_GAME_START);

        GameThreeEventEmitter.emitGameHasStartedEvent(
            this.roomId,
            InitialParameters.COUNTDOWN_TIME_GAME_START,
            this.gameName
        );
        this.stageController?.handleNewRound();
    }

    sendPhotoTopic() {
        //TODO verify game state
        //TODO reset player has photo
        const topic = this.photoTopics?.nextTopic();
        this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        this.stageController?.updateStage(GameThreeGameState.TakingPhoto);
        //send to screen
        GameThreeEventEmitter.emitNewTopic(this.roomId, topic!, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
    }

    pauseGame(): void {
        super.pauseGame();
        GameThreeEventEmitter.emitGameHasPausedEvent(this.roomId);
    }

    resumeGame(): void {
        super.resumeGame();
        GameThreeEventEmitter.emitGameHasResumedEvent(this.roomId);
    }

    stopGameUserClosed() {
        super.stopGameUserClosed();
        GameThreeEventEmitter.emitGameHasStoppedEvent(this.roomId);
    }

    stopGameAllUsersDisconnected() {
        super.stopGameAllUsersDisconnected();
    }

    protected handleInput(message: IMessage) {
        //TODO validate inputs - like correct userId...
        switch (message.type) {
            case GameThreeMessageTypes.PHOTO: {
                this.stageController!.handleReceivedPhoto(message as IMessagePhoto);
                break;
            }
            case GameThreeMessageTypes.PHOTO_VOTE: {
                this.handleReceivedPhotoVote(message as IMessagePhotoVote);
                break;
            }
            case GameThreeMessageTypes.FINISHED_PRESENTING: {
                this.countdown?.stopCountdown();
                this.handlePresentingRoundFinished();

                break;
            }
            default:
                console.info(message);
        }
    }

    //********************** Helper Functions **********************/

    handleReceivedFinalPhoto(message: IMessagePhoto) {
        const player = this.players.get(message.userId!);
        if (player && !player.hasReceivedFinalPhotos()) {
            player.receivedFinalPhoto(message.url);
            player.addPointsFinalRound(1);
        }

        if (this.allFinalPhotosReceived()) {
            this.handleAllFinalPhotosReceived();
            // this.handleFinishedTakingFinalPhotos();
        }
    }

    //TODO make players class??
    private allFinalPhotosReceived(): boolean {
        return Array.from(this.players.values()).every(player => player.finalPhotosAreReceived());
    }

    // *** Voting ***
    private handleReceivedPhotoVote(message: IMessagePhotoVote) {
        switch (this.stageController!.stage) {
            case GameThreeGameState.Voting:
                this.handleSinglePhotoVoteReceived(message);
                break;
            case GameThreeGameState.FinalVoting:
                this.handleFinalPhotoVoteReceived(message);
                break;
        }
    }

    private handleSinglePhotoVoteReceived(message: IMessagePhotoVote) {
        const player = this.players.get(message.photographerId!);
        const voter = this.players.get(message.voterId);
        if (player && voter && !voter.hasVoted(this.stageController!.roundIdx)) {
            player?.addPoints(this.stageController!.roundIdx, 1);
            // if (voter) {
            voter.voted(this.stageController!.roundIdx);
            // voter.roundInfo[this.stageController!.roundIdx].points += 1; //point for voting //TODO???
            // }
        }
        // this.players.get(message.voterId)?.roundInfo[this.stageController!.roundIdx].voted = true

        if (this.allVotesReceived()) {
            this.handleAllVotesReceived();
            //Do something
        }
    }

    handleFinishedVoting() {
        this.removeVotingPointsFromPlayersNoParticipation();
        this.sendPhotoVotingResultsToScreen();

        //TODO if time over or if all received - check what photos received and forward to screens
    }

    private removeVotingPointsFromPlayersNoParticipation() {
        Array.from(this.players.values()).forEach(player => {
            player.removePoints(this.stageController!.roundIdx);
        });
    }

    private allVotesReceived(): boolean {
        return Array.from(this.players.values()).every(player => player.hasVoted(this.stageController!.roundIdx));
    }

    private handleAllVotesReceived() {
        //TODO
        // send all photos, start voting
        this.countdown?.stopCountdown();
        this.sendPhotoVotingResultsToScreen();
    }

    private sendPhotoVotingResultsToScreen() {
        const votingResults: votingResultsPhotographerMapper[] = Array.from(this.players.values()).map(player => {
            return {
                photographerId: player.id,
                points: player.getRoundPoints(this.stageController!.roundIdx),
            };
        });
        this.stageController!.updateStage(GameThreeGameState.ViewingResults);
        this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);

        GameThreeEventEmitter.emitPhotoVotingResults(
            this.roomId,
            votingResults,
            InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS
        );
    }

    // *** Final round ***

    sendTakeFinalPhotosCountdown() {
        this.stageController!.updateStage(GameThreeGameState.TakingFinalPhotos);
        this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS);
        GameThreeEventEmitter.emitTakeFinalPhotosCountdown(
            this.roomId,
            InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS
        );
    }

    private handleAllFinalPhotosReceived() {
        this.countdown?.stopCountdown();
        this.handleFinishedTakingFinalPhotos();
    }

    handleFinishedTakingFinalPhotos() {
        // this.playerPresentOrder = shuffleArray(
        //     Array.from(this.players.values())
        //         .filter(player => player.finalRoundInfo.received)
        //         .map(player => player.id)
        // );
        this.stageController!.updateStage(GameThreeGameState.PresentingFinalPhotos);
        this.handlePresentingRoundFinished();
    }

    handlePresentingRoundFinished() {
        if (this.presentationController!.isAnotherPresenterAvailable()) {
            this.sendFinalPhotosToScreen();
        } else {
            this.handlePresentingFinalPhotosFinished();
        }
    }

    private sendFinalPhotosToScreen() {
        const photographerId = this.presentationController!.nextPresenter();
        const photoUrls: string[] = Array.from(this.players.values())
            .find(player => player.id === photographerId)!
            .getFinalUrls();

        this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
        GameThreeEventEmitter.emitPresentFinalPhotosCountdown(
            this.roomId,
            InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS,
            photographerId,
            this.players.get(photographerId)!.name,
            photoUrls
        );
    }

    private handlePresentingFinalPhotosFinished() {
        const playerNameIds: PlayerNameId[] = Array.from(this.players.values()).map(player => {
            return { id: player.id, name: player.name };
        });

        this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VOTE);
        this.stageController!.updateStage(GameThreeGameState.FinalVoting);
        GameThreeEventEmitter.emitVoteForFinalPhotos(this.roomId, InitialParameters.COUNTDOWN_TIME_VOTE, playerNameIds);
    }

    private handleFinalPhotoVoteReceived(message: IMessagePhotoVote) {
        const player = this.players.get(message.photographerId!);
        const voter = this.players.get(message.voterId);
        if (player && voter && !voter.hasVotedFinal()) {
            player?.addPointsFinalRound(1);

            voter.votedFinal();
        }

        if (this.allFinalVotesReceived()) {
            this.handleAllFinalVotesReceived();
            //Do something
        }
        // const player = this.players.get(message.userId!);
        // if (player && !player.finalRoundInfo.received) player.receivedFinalPhoto(message.url);

        // if (this.allFinalPhotosReceived()) {
        //     this.handleAllFinalPhotosReceived();
        //     // this.handleFinishedTakingFinalPhotos();
        // }
    }

    private allFinalVotesReceived(): boolean {
        return Array.from(this.players.values()).every(player => player.hasVotedFinal());
    }

    private handleAllFinalVotesReceived() {
        //TODO
        // send all photos, start voting
        this.countdown?.stopCountdown();
        this.handleFinishedFinalVoting();
    }

    handleFinishedFinalVoting() {
        const playerRanks: GameThreePlayerRank[] = Array.from(this.players.values()).map(player => {
            return {
                id: player.id,
                name: player.name,
                points: player.getTotalPoints(),
                rank: 0,
                isActive: player.isActive,
            };
        });

        playerRanks
            .sort((a, b) => b.points - a.points)
            .map(result => {
                const rank = this.rankSuccessfulUser(result.points);
                this.players.get(result.id)!.rank = rank;
                result.rank = rank;
                return result;
            });

        this.stageController!.updateStage(GameThreeGameState.ViewingFinalResults);
        this.gameState = GameState.Finished;
        // GameThreeEventEmitter.emitViewingFinalResults(this.roomId, finalResults);
        GameThreeEventEmitter.emitGameHasFinishedEvent(this.roomId, this.gameState, playerRanks);

        //TODO Leaderboard
    }
}
