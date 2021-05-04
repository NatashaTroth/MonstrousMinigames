import { DisconnectedUserError } from '../customErrors';

export function verifyUserIsActive(userId: string, userIsActive: boolean): void {
    if (!userIsActive) {
        throw new DisconnectedUserError(`User ${userId} is not active (was disconnected).`, userId);
    }
}
