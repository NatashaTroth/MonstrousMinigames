import { History } from 'history';

import { PlayerRank } from '../../../contexts/ScreenSocketContextProvider';
import { screenFinishedRoute } from '../../../utils/routes';
import { GameHasFinishedMessage } from '../../typeGuards/finished';

export interface HandleGameHasFinishedMessage {
    data: GameHasFinishedMessage;
    roomId: string;
}

interface Dependencies {
    setFinished: (val: boolean) => void;
    setPlayerRanks: (val: PlayerRank[]) => void;
    history: History;
}

export function handleGameHasFinishedMessage(dependencies: Dependencies) {
    return (props: HandleGameHasFinishedMessage) => {
        const { data, roomId } = props;

        const { setFinished, setPlayerRanks, history } = dependencies;
        setFinished(true);
        setPlayerRanks(data.data.playerRanks);
        history.push(screenFinishedRoute(roomId));
    };
}
