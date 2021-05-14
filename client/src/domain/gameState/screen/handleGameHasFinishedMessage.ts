import { History } from 'history';

import { PlayerRank } from '../../../contexts/ScreenSocketContextProvider';
import { GameHasFinishedMessage } from '../../typeGuards/finished';
import { TimedOutMessage } from '../../typeGuards/timedOut';

interface HandleGameHasFinishedMessage {
    data: GameHasFinishedMessage | TimedOutMessage;
    roomId: string;
    dependencies: {
        setFinished: (val: boolean) => void;
        setPlayerRanks: (val: PlayerRank[]) => void;
        history: History;
    };
}

export function handleGameHasFinishedMessage(props: HandleGameHasFinishedMessage) {
    const { data, dependencies, roomId } = props;
    const { setFinished, setPlayerRanks, history } = dependencies;
    setFinished(true);
    setPlayerRanks(data.data.playerRanks);
    history.push(`/screen/${roomId}/finished`);
}
