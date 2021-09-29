import {
    CannotStartEmptyGameError,
    CharacterNotAvailableError,
    GameAlreadyStartedError,
    UsersNotReadyError,
} from '../customErrors';
import { GameNames } from '../enums/gameNames';
import { Globals } from '../enums/globals';
import { ScreenStates } from '../enums/screenStates';
import { CatchFoodGame, GameTwo } from '../gameplay';
import { MaxNumberUsersExceededError } from '../gameplay/customErrors';
import Game from '../gameplay/Game';
// import { IGameStateBase } from '../gameplay/interfaces/IGameStateBase';
import Leaderboard from '../gameplay/leaderboard/Leaderboard';
import { ScreenInfo } from '../interfaces/interfaces';
import User from './user';

class Room {
    public id: string;
    public users: Array<User>;
    public timestamp: number;
    public game: Game;
    private state: RoomStates;
    private leaderboard: Leaderboard;
    public screenState: string;
    public screens: Array<ScreenInfo>;
    public firstPhaserScreenLoaded: boolean;
    public allScreensLoadedTimeout: undefined | ReturnType<typeof setTimeout>;
    public sentAllScreensLoaded: boolean;

    constructor(id: string, game?: Game) {
        this.id = id;
        this.users = [];
        this.timestamp = Date.now();
        this.leaderboard = new Leaderboard(this.id);
        this.game = game || new CatchFoodGame(this.id, this.leaderboard);
        this.game.leaderboard = this.leaderboard;
        this.state = RoomStates.OPEN;
        this.screens = [];
        this.screenState = ScreenStates.LOBBY;
        this.firstPhaserScreenLoaded = false;
        this.allScreensLoadedTimeout = undefined;
        this.sentAllScreensLoaded = false;
    }

    public clear(): void {
        this.users.forEach(user => {
            user.clear();
        });
        this.screens = [];
        this.state = RoomStates.CLOSED;
    }

    public addUser(user: User): void {
        if (!this.isOpen()) {
            throw new GameAlreadyStartedError();
        }
        if (this.getUserCount() >= Globals.MAX_PLAYER_NUMBER) {
            throw new MaxNumberUsersExceededError(
                `Too many players. Max ${Globals.MAX_PLAYER_NUMBER} Players`,
                Globals.MAX_PLAYER_NUMBER
            );
        }

        this.users.push(user);
        this.updateUserNumbers();
    }

    private updateUserNumbers(): void {
        this.users.forEach(function (user, i) {
            user.setNumber(i + 1);
        });
    }

    public getUserCount(): number {
        return this.users.length;
    }

    public removeUser(toBeRemoved: User): void {
        const index = this.users.indexOf(toBeRemoved);
        this.users.splice(index, 1);
        this.updateUserNumbers();
    }

    public userDisconnected(userId: string): void {
        const user = this.getUserById(userId);
        if (this.isOpen()) {
            this.removeUser(user);
        } else {
            if (this.isPlaying()) {
                user.setActive(false);
                if (this.hasActiveUsers()) {
                    this.game.disconnectPlayer(userId);
                } else {
                    this.setClosed();
                    this.game.stopGameAllUsersDisconnected();
                }
            }
        }
    }

    private getActiveUsers(): Array<User> {
        const activeUsers = this.users.filter((user: User) => {
            return user.active;
        });
        return activeUsers;
    }

    private hasActiveUsers(): boolean {
        return this.getActiveUsers().length !== 0;
    }

    private getNotReadyUsers(): Array<User> {
        const readyUsers = this.users.filter((user: User) => {
            return !user.isReady();
        });
        return readyUsers;
    }

    private hasNotReadyUsers(): boolean {
        return this.getNotReadyUsers().length !== 0;
    }

    public updateTimestamp(): void {
        this.timestamp = Date.now();
    }

    public setGame(gameName: string): void {
        switch (gameName) {
            case GameNames.GAME1:
                this.game = new CatchFoodGame(this.id, this.leaderboard);
                break;
            case GameNames.GAME2:
                this.game = new GameTwo(this.id, this.leaderboard);
                break;
        }
    }

    public createNewGame(game?: Game) {
        if (this.users.length === 0) {
            throw new CannotStartEmptyGameError();
        }
        if (this.hasNotReadyUsers()) {
            throw new UsersNotReadyError();
        }
        if (game) {
            this.game = game;
            this.game.leaderboard = this.leaderboard;
        }
        this.setState(RoomStates.CREATED);

        this.game.createNewGame(this.users);
        this.updateTimestamp();
        // return this.game.getGameStateInfo();
    }

    public allPhaserGamesReady() {
        return this.screens.every(screen => {
            if (screen.phaserGameReady) return true;
            return false;
        });
    }

    public setScreenPhaserGameReady(screenId: string, value: boolean) {
        const index = this.screens.findIndex(element => element.id === screenId);
        this.screens[index].phaserGameReady = value;
    }

    public setAllScreensPhaserGameReady(value: boolean) {
        this.screens.forEach(screen => (screen.phaserGameReady = value));
    }

    public getScreensPhaserNotReady(): ScreenInfo[] {
        return this.screens.filter(screen => screen.phaserGameReady === false);
    }

    public startGame() {
        this.setState(RoomStates.PLAYING);
        this.game.startGame();
    }

    public stopGame() {
        this.game?.stopGameUserClosed();
    }

    public getUserById(userId: string): User {
        const user = this.users.filter(function (u) {
            return u.id === userId;
        });
        return user[0];
    }

    public async resetGame() {
        this.users = this.getActiveUsers();
        this.clearInactiveUsers();
        this.setOpen();
    }

    private clearInactiveUsers() {
        const inactiveUsers = this.users.filter((user: User) => {
            return !user.active;
        });
        inactiveUsers.forEach(user => {
            user.clear();
        });
    }

    private setState(state: RoomStates): void {
        this.state = state;
    }

    public isOpen(): boolean {
        return this.state === RoomStates.OPEN;
    }
    public isCreated(): boolean {
        return this.state === RoomStates.CREATED;
    }
    public isPlaying(): boolean {
        return this.state === RoomStates.PLAYING;
    }
    public isFinished(): boolean {
        return this.state === RoomStates.FINISHED;
    }
    public isPaused(): boolean {
        return this.state === RoomStates.PAUSED;
    }
    public isClosed(): boolean {
        return this.state === RoomStates.CLOSED;
    }
    public setClosed(): void {
        this.setState(RoomStates.CLOSED);
    }
    public setOpen(): void {
        this.setState(RoomStates.OPEN);
    }
    public setPlaying(): void {
        this.setState(RoomStates.PLAYING);
    }
    public setFinished(): void {
        this.setState(RoomStates.FINISHED);
    }
    public setPaused(): void {
        this.setState(RoomStates.PAUSED);
    }

    public pauseGame(): void {
        this.game.pauseGame();
    }

    public resumeGame(): void {
        this.game.resumeGame();
    }

    public addScreen(screenId: string): void {
        this.screens.push({ id: screenId, phaserGameReady: false });
    }
    public removeScreen(screenId: string): void {
        const index = this.screens.findIndex(element => element.id === screenId);
        // const index = this.screens.indexOf({ id: screenId });
        this.screens.splice(index, 1);
    }
    public isAdminScreen(screenId: string): boolean {
        //TODO test
        return this.screens.findIndex(element => element.id === screenId) === 0;
        // return this.screens.indexOf({ id: screenId }) === 0;
    }
    public getAdminScreenId(): string {
        return this.screens[0]?.id;
    }
    public getAvailableCharacters(): Array<number> {
        const characters: Array<number> = [];
        for (let i = 0; i < Globals.CHARACTER_COUNT; i++) {
            characters.push(i);
        }
        return characters.filter(x => !this.getChosenCharacters().includes(x));
    }
    public getChosenCharacters(): Array<number> {
        const chosenCharacters: Array<number> = [];
        this.users.forEach(user => {
            chosenCharacters.push(user.characterNumber);
        });
        return chosenCharacters;
    }
    public setUserCharacter(user: User, character: number): void {
        if (this.getAvailableCharacters().includes(character)) {
            user.setCharacterNumber(character);
        } else {
            throw new CharacterNotAvailableError();
        }
    }
    public setScreenState(screenState: string): void {
        this.screenState = screenState;
    }
    public getScreenState(): string {
        return this.screenState;
    }
}

export default Room;

export enum RoomStates {
    OPEN,
    CREATED,
    PLAYING,
    FINISHED,
    PAUSED,
    CLOSED,
}
