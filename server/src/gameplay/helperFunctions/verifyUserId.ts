import { PlayerState } from "../catchFood/interfaces";
import { HashTable } from "../interfaces";

export function verifyUserId(
  playersState: HashTable<PlayerState>,
  userId: string
) : void {
  // if (!playersState.hasOwnProperty(userId))
  if (!Object.prototype.hasOwnProperty.call(playersState, userId))
    throw new Error(`User Id ${userId} is not registered to the game.`);
}
