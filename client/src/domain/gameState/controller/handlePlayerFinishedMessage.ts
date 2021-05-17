import { PlayerFinishedMessage } from '../../typeGuards/playerFinished';

interface HandlePlayerFinished {
    data: PlayerFinishedMessage;
    playerFinished: boolean;
    dependencies: {
        setPlayerFinished: (val: boolean) => void;
        setPlayerRank: (val: number) => void;
    };
}

export function handlePlayerFinishedMessage(props: HandlePlayerFinished) {
    const { data, dependencies, playerFinished } = props;
    const { setPlayerFinished, setPlayerRank } = dependencies;

    if (!playerFinished) {
        setPlayerFinished(true);
        setPlayerRank(data.rank);
    }
}
