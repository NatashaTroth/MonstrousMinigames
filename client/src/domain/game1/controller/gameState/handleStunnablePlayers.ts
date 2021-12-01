import { StunnablePlayersMessage } from "../../../typeGuards/game1/stunnablePlayers";

interface Dependencies {
    setStunnablePlayers: (val: string[]) => void;
}

export const handleStunnablePlayers = (dependencies: Dependencies) => {
    return (data: StunnablePlayersMessage) => {
        dependencies.setStunnablePlayers(data.stunnablePlayers);
    };
};
