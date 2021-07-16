import { WrongUserIdError } from '../customErrors';
import { HashTable, IPlayerState } from '../interfaces';

const isMap = (obj: any): obj is Map<any, any> =>
    'clear' in obj
    && 'delete' in obj
    && 'forEach' in obj
    && 'get' in obj
    && 'has' in obj
    && 'set' in obj
    && 'size' in obj;

export function verifyUserId(playersState: HashTable<IPlayerState> | Map<string, IPlayerState>, userId: string): void {
    const isOkay = isMap(playersState) ? playersState.has(userId) : Object.prototype.hasOwnProperty.call(playersState, userId);
    if (!isOkay)
        throw new WrongUserIdError(`User Id ${userId} is not registered to the game.`, userId);
}
