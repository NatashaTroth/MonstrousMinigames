import { PlayerState } from '../catchFood/interfaces';
import { WrongUserIdError } from '../customErrors';
import { HashTable } from '../interfaces';
import { UserPoints } from '../leaderboard/interfaces/UserPoints';

export function verifyUserId(playersState: HashTable<PlayerState> | HashTable<UserPoints>, userId: string): void {
    // if (!playersState.hasOwnProperty(userId))
    if (!Object.prototype.hasOwnProperty.call(playersState, userId))
        throw new WrongUserIdError(`User Id ${userId} is not registered to the game.`, userId);
}
