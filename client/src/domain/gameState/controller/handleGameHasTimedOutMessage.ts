import { controllerFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';
import { TimedOutMessage } from '../../typeGuards/timedOut';

interface HandleGameHasTimedOut {
    data: TimedOutMessage;
    roomId: string;
    dependencies: { setPlayerFinished: (val: boolean) => void; setPlayerRank: (val: number) => void };
}

export function handleGameHasTimedOutMessage(props: HandleGameHasTimedOut) {
    const { data, dependencies, roomId } = props;
    const { setPlayerFinished, setPlayerRank } = dependencies;
    setPlayerFinished(true);
    setPlayerRank(data.rank);
    history.push(controllerFinishedRoute(roomId));
}
