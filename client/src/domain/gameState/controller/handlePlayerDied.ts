import { PlayerDiedMessage } from '../../typeGuards/playerDied';

interface HandlePlayerDied {
    data: PlayerDiedMessage;
    dependencies: { setPlayerDead: (val: boolean) => void; setPlayerRank: (val: number) => void };
}

export const handlePlayerDied = ({ data, dependencies }: HandlePlayerDied) => {
    const { setPlayerDead, setPlayerRank } = dependencies;

    setPlayerDead(true);
    setPlayerRank(data.rank);
};
