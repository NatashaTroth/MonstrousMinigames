import EventEmitter from 'events';

// import { localDevelopment } from '../../constants';
import User from '../classes/user';
import { Globals } from '../enums/globals';
import { IMessage } from '../interfaces/messages';
import { MaxNumberUsersExceededError } from './customErrors';
import { GameState } from './enums';
import { verifyGameState } from './helperFunctions/verifyGameState';
import { verifyUserId } from './helperFunctions/verifyUserId';
import { IGameInterface } from './interfaces';
import { IGameStateBase } from './interfaces/IGameStateBase';
import Leaderboard from './leaderboard/Leaderboard';
import Player from './Player';

abstract class Game<TPlayer extends Player = Player, TGameState extends IGameStateBase = IGameStateBase>
    extends EventEmitter
    implements IGameInterface<TPlayer, TGameState> {
    public static readonly EVT_FRAME_READY = 'frame-ready';

    // ********** Public *****************************
    public gameState = GameState.Initialised;
    public players = new Map<string, TPlayer>();
    public gameStateMessage: string;
    public gameName = '';
    public sendGameStateUpdates: boolean;

    constructor(
        public roomId: string,
        public fps_ms: number = Globals.GAME_STATE_UPDATE_MS,
        public leaderboard?: Leaderboard,
        protected maxNumberOfPlayers: number = Globals.MAX_PLAYER_NUMBER
    ) {
        super();
        this.gameStateMessage = 'gameState';
        this.sendGameStateUpdates = true;
    }

    createNewGame(users: User[]) {
        verifyGameState(this.gameState, [GameState.Initialised, GameState.Finished, GameState.Stopped]);
        this.beforeCreateNewGame();
        if (users.length > this.maxNumberOfPlayers) {
            throw new MaxNumberUsersExceededError(
                `Too many players. Max ${this.maxNumberOfPlayers} Players`,
                this.maxNumberOfPlayers
            );
        }

        this.currentRank = 1;
        this._currentBackRank = users.length;
        this.users = users;
        this._rankDictionary.clear();
        this._backRankDictionary.clear();

        this.players.clear();
        for (const user of users) {
            this.players.set(user.id, this.mapUserToPlayer(user));
        }

        // TODO delete: add extra players for local dev
        // if (localDevelopment && users.length <= 2) {
        //     for (let i = 0; i < 2; i++) {
        //         const newUser = users[0];
        //         newUser.id = i.toString() + 'lkjhgkljhg';
        //         this.players.set(newUser.id, this.mapUserToPlayer(newUser));
        //     }
        // }
        this.postProcessPlayers(this.players.values());

        this.gameState = GameState.Created;
    }
    stopGameUserClosed() {
        this.stopGame();
    }
    stopGameAllUsersDisconnected() {
        this.stopGame();
    }
    resumeGame() {
        verifyGameState(this.gameState, [GameState.Paused]);
        const gameTime = this.gameTime;
        this.gameState = GameState.Started;
        this._lastFrameAt = this._lastFrameAt - this._gameStartedAt;
        this._gameStartedAt = Date.now() - gameTime;
        this._lastFrameAt = this._lastFrameAt + this._gameStartedAt;

        this._gameLoop();
    }
    startGame() {
        this._gameStartedAt = Date.now();
        this._lastFrameAt = Date.now();
        this.gameState = GameState.Started;

        this._gameLoop();
    }
    pauseGame() {
        verifyGameState(this.gameState, [GameState.Started]);
        this.gameState = GameState.Paused;

        this._gamePausedAt = Date.now();
    }
    stopGame() {
        verifyGameState(this.gameState, [GameState.Started, GameState.Paused]);
        this.gameState = GameState.Stopped;
    }
    disconnectPlayer(userId: string) {
        verifyGameState(this.gameState, [
            GameState.Initialised,
            GameState.Started,
            GameState.Created,
            GameState.Paused,
        ]);
        verifyUserId(this.players, userId);

        const player = this.players.get(userId)!;

        if (!player.isActive) return false;

        player.isActive = false;

        if (this.allPlayersDisconnected) {
            this.stopGameAllUsersDisconnected();
        }

        return true;
    }
    reconnectPlayer(userId: string) {
        verifyGameState(this.gameState, [
            GameState.Initialised,
            GameState.Started,
            GameState.Created,
            GameState.Paused,
        ]);
        verifyUserId(this.players, userId);

        const player = this.players.get(userId)!;

        if (player.isActive) return false;

        player.isActive = true;

        return true;
    }
    async receiveInput(message: IMessage) {
        if (this.gameState !== GameState.Started) {
            return;
        }

        await this.handleInput(message);
    }
    abstract getGameStateInfo(): TGameState;

    // ********** Protected **************************
    protected users: User[] = [];
    protected currentRank = 1;

    protected abstract beforeCreateNewGame(): void;
    protected abstract mapUserToPlayer(user: User): TPlayer;
    protected abstract update(timeElapsed: number, timeElapsedSinceLastFrame: number): Promise<void> | void;
    protected abstract handleInput(message: IMessage): Promise<void> | void;
    protected abstract postProcessPlayers(playersIterable: IterableIterator<TPlayer>): void;
    protected rankSuccessfulUser(rankingMetric: number) {
        const currentRank = this.currentRank++;

        if (this._rankDictionary.has(rankingMetric)) {
            return this._rankDictionary.get(rankingMetric)!;
        }

        this._rankDictionary.set(rankingMetric, currentRank);
        return currentRank;
    }
    protected rankFailedUser(rankingMetric: number) {
        const currentRank = this._currentBackRank--;

        if (this._backRankDictionary.has(rankingMetric)) {
            const previousRank = this._rankDictionary.get(rankingMetric)!;
            const newRank = previousRank - 1;
            this._backRankDictionary.set(rankingMetric, newRank);
            for (const player of this.players.values()) {
                if (player.rank !== previousRank) continue;
                player.rank = newRank;
            }

            return newRank;
        }

        this._backRankDictionary.set(rankingMetric, currentRank);

        return currentRank;
    }
    protected get gameTime() {
        switch (this.gameState) {
            case GameState.Started:
                return Date.now() - this._gameStartedAt;
            case GameState.Paused:
            case GameState.Stopped:
            case GameState.Finished:
                return this._gamePausedAt - this._gameStartedAt;
            default:
                return 0;
        }
    }
    protected get gameStartedAt() {
        return this._gameStartedAt;
    }

    // ********** Private ****************************
    private _gameStartedAt = 0;
    private _gamePausedAt = 0;
    private _lastFrameAt = 0;
    private _currentBackRank = -1;
    private _rankDictionary = new Map<number, number>();
    private _backRankDictionary = new Map<number, number>();
    private _gameLoopActive = false;

    private async _update() {
        const now = Date.now();
        const timeElapsed = this.gameTime;
        const timeElapsedSinceLastFrame = now - this._lastFrameAt;
        this._lastFrameAt = now;

        try {
            await Promise.all([
                this.update(timeElapsed, timeElapsedSinceLastFrame),
                ...Array.from(this.players.values()).map(player =>
                    player.update(timeElapsed, timeElapsedSinceLastFrame)
                ),
            ]);
            this.emit(Game.EVT_FRAME_READY, this);
        } catch (e) {
            console.error(e);
        }
    }
    private async _gameLoop() {
        if (this._gameLoopActive) return;
        this._gameLoopActive = true;
        // TODO: lag catch up see https://gameprogrammingpatterns.com/game-loop.html#play-catch-up
        while (this.gameState === GameState.Started) {
            await this._update();
            await new Promise(resolve => setTimeout(resolve, this.fps_ms));
        }
        this._gameLoopActive = false;
    }
    private get allPlayersDisconnected() {
        for (const player of this.players.values()) {
            if (player.isActive) return false;
        }

        return true;
    }
}

export default Game;
