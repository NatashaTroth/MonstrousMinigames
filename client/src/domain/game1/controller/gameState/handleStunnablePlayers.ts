import { StunnablePlayersMessage } from '../../../typeGuards/game1/stunnablePlayers';

interface HandleStunnablePlayersMessage {
    data: StunnablePlayersMessage;
    dependencies: {
        setStunnablePlayers: (val: string[]) => void;
    };
}

export const handleStunnablePlayers = (props: HandleStunnablePlayersMessage) => {
    const { data, dependencies } = props;
    dependencies.setStunnablePlayers(data.stunnablePlayers);
};
