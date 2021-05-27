export function handleSetGameStarted(
    started: boolean,
    dependencies: {
        setGameStarted: (val: boolean) => void;
    }
) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    dependencies.setGameStarted(started);
}
