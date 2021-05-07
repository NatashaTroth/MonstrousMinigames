import { IGameFinished } from '../../contexts/ControllerSocketContextProvider';

export function gameHasTimedOut(
    data: IGameFinished,
    dependencies: { setPlayerFinished: (val: boolean) => void; setPlayerRank: (val: number) => void }
) {
    const { setPlayerFinished, setPlayerRank } = dependencies;
    setPlayerFinished(true);
    setPlayerRank(data.rank);
}
