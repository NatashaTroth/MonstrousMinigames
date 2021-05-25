interface HandleGameHasTimedOutMessage {
    dependencies: {
        setHasTimedOut: (val: boolean) => void;
    };
}

export function handleGameHasTimedOutMessage(props: HandleGameHasTimedOutMessage) {
    const { dependencies } = props;
    const { setHasTimedOut } = dependencies;
    setHasTimedOut(true);
}
