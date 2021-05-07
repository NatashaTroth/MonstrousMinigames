import history from '../../history/history';

export function gameHasStarted(roomId: string | undefined, dependencies: { setGameStarted: (val: boolean) => void }) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    dependencies.setGameStarted(true);

    history.push(`/controller/${roomId}/game1`);
}
