export function handleSetSheepGameStarted(
    started: boolean,
    dependencies: {
        setSheepGameStarted: (val: boolean) => void;
    }
) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    dependencies.setSheepGameStarted(started);
}
