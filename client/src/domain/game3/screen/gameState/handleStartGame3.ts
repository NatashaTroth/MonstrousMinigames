import { GameNames } from "../../../../utils/games";
import { screenGame3Route } from "../../../../utils/routes";
import history from "../../../history/history";

interface HandleStartGameProps {
    roomId: string;
    data: {
        gameId: GameNames;
    };
}

export default function handleStartGame3({ roomId, data }: HandleStartGameProps) {
    switch (data.gameId) {
        case GameNames.game3:
            history.push(screenGame3Route(roomId));
            return;
    }
}
