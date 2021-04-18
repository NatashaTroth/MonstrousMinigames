export function verifyUserIsActive(userId: string, userIsActive: boolean): void {
    if (!userIsActive) {
        throw new Error(`User ${userId} is not active (was disconnected).`);
    }
}
