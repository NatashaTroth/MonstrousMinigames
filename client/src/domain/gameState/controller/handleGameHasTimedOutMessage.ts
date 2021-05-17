import { TimedOutMessage } from '../../typeGuards/timedOut';

interface HandleGameHasTimedOut {
    data: TimedOutMessage;
    dependencies: { setPlayerFinished: (val: boolean) => void; setPlayerRank: (val: number) => void };
}

export function handleGameHasTimedOutMessage(props: HandleGameHasTimedOut) {
    const { data, dependencies } = props;
    const { setPlayerFinished, setPlayerRank } = dependencies;
    setPlayerFinished(true);
    setPlayerRank(data.rank);
}
