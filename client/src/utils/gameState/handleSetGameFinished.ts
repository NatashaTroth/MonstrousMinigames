export function handleSetGameFinished(
    finished: boolean,
    dependencies: {
        setFinished: (val: boolean) => void;
    }
) {
    document.body.style.overflow = 'visible';
    document.body.style.position = 'static';
    document.body.style.userSelect = 'auto';

    dependencies.setFinished(finished);
}
