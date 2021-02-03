import { PlayerState } from "../catchFood/interfaces";
import { HashTable } from "../interfaces";

export function verifyUserId(
  playersState: HashTable<PlayerState>,
  userId: string
) {
  if (!playersState.hasOwnProperty(userId))
    throw new Error(`User Id ${userId} is not registered to the game.`);
}
