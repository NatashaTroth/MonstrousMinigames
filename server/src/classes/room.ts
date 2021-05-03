import { GameAlreadyStartedError } from '../customErrors';
import { Globals } from '../enums/globals';
import { CatchFoodGame } from '../gameplay';
import { GameStateInfo } from '../gameplay/catchFood/interfaces';
import { MaxNumberUsersExceededError } from '../gameplay/customErrors';
import Leaderboard from '../gameplay/leaderboard/Leaderboard';
import User from './user';

class Room {
    public id: string;
    public users: Array<User>;
    public timestamp: number;
    public game: CatchFoodGame;
    public admin: User | null;
    private state: RoomStates;
    private leaderboard: Leaderboard;

    constructor(id: string) {
        this.id = id;
        this.users = [];
        this.timestamp = Date.now();
        this.leaderboard = new Leaderboard(this.id);
        this.game = new CatchFoodGame(this.id, this.leaderboard);
        this.admin = null;
        this.state = RoomStates.OPEN;
    }

    public clear(): void {
        this.users.forEach(user => {
            user.clear();
        });
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

        if (this.users.length === 0) this.admin = user;
        this.users.push(user);
        this.updateUserNumbers();
    }

    private updateUserNumbers(): void {
        this.users.forEach(function (user, i) {
            user.setNumber(i + 1);
        });
    }

    public isAdmin(user: User): boolean {
        return user === this.admin;
    }

    public getUserCount(): number {
        return this.users.length;
    }

    public removeUser(toBeRemoved: User): void {
        const index = this.users.indexOf(toBeRemoved);
        this.users.splice(index, 1);
        this.resolveAdmin();
        this.updateUserNumbers();
    }

    public userDisconnected(userId: string): void {
        const user = this.getUserById(userId);
        if (this.isOpen()) {
            this.removeUser(user);
        } else {
            if (this.isPlaying()) {
                user.setActive(false);
                if (!this.hasActiveUsers()) {
                    this.setClosed();
                }
            }
        }
    }
    private resolveAdmin(): void {
        if (this.users.length > 0) {
            if (this.users.filter(u => u === this.admin).length === 0) {
                this.admin = this.users[0];
            }
        } else {
            this.admin = null;
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

    public updateTimestamp(): void {
        this.timestamp = Date.now();
    }

    public startGame(): GameStateInfo {
        this.setState(RoomStates.PLAYING);
        this.game.createNewGame(this.users);
        return this.game.getGameStateInfo();
    }

    public stopGame() {
        this.game?.stopGame();
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
        this.setState(RoomStates.OPEN);
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
    public isPlaying(): boolean {
        return this.state === RoomStates.PLAYING;
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
    public setPaused(): void {
        this.setState(RoomStates.PAUSED);
    }

    public pauseGame(): void {
        this.game.pauseGame();
    }

    public resumeGame(): void {
        this.game.resumeGame();
    }
}

export default Room;

export enum RoomStates {
    OPEN,
    PLAYING,
    PAUSED,
    CLOSED,
}
