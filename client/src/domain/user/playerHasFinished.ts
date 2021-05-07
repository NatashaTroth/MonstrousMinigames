import { IGameFinished } from '../../contexts/ControllerSocketContextProvider';

export function playerHasFinished(
    data: IGameFinished,
    playerFinished: boolean,
    dependencies: { setPlayerFinished: (val: boolean) => void; setPlayerRank: (val: number) => void }
) {
    const { setPlayerFinished, setPlayerRank } = dependencies;

    if (!playerFinished) {
        setPlayerFinished(true);
        setPlayerRank(data.rank);
    }
}
