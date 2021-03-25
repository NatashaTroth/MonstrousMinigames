import { CatchFoodGame } from '../gameplay';
import User from './user';

class Room {
    public id: string
    public users: Array<User>
    public timestamp: number
    public game: CatchFoodGame
    public admin: User | null
    private state: RoomStates

    constructor(id: string) {
        this.id = id
        this.users = []
        this.timestamp = Date.now()
        this.game = new CatchFoodGame()
        this.admin = null
        this.state = RoomStates.OPEN
    }

    public clear(): void {
        this.users.forEach(user => {
            user.clear();
        });
        this.state = RoomStates.CLOSED;
    }

    public addUser(user: User): boolean {
        if (this.isOpen()) {
            if (this.users.length === 0) this.admin = user;
            this.users.push(user);
            return true;
        }
        return false;
    }
    public isAdmin(user: User): boolean {
        return user === this.admin;
    }

    public removeUser(toBeRemoved: User): void {
        const index = this.users.indexOf(toBeRemoved);
        this.users.splice(index, 1);
        this.resolveAdmin();
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

    public startGame(): void {
        this.setState(RoomStates.PLAYING)
        this.game.createNewGame(this.users)
    }

    public stopGame() {
        this.game?.stopGame()
    }

    public getUserById(userId: string): User {
        const user = this.users.filter(function (u) {
            return u.id === userId;
        });
        return user[0];
    }

    public async resetGame() {
        this.clearInactiveUsers()
        this.users = this.getActiveUsers()
        this.setState(RoomStates.OPEN)
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
}

export default Room;

export enum RoomStates {
    OPEN,
    PLAYING,
    CLOSED,
}
