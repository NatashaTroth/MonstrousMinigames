import InitialParameters from '../../../src/gameplay/gameOne/constants/InitialParameters';
import { GameOneMsgType } from '../../../src/gameplay/gameOne/enums';
import GameOnePlayer from '../../../src/gameplay/gameOne/GameOnePlayer';
import { IMessage } from '../../../src/interfaces/messages';
import { roomId, trackLength, users } from '../mockData';

export const pushChasersMessage: IMessage = {
    type: GameOneMsgType.CHASERS_WERE_PUSHED,
    userId: users[0].id,
};

export const players = new Map<string, GameOnePlayer>();
for (const user of users) {
    players.set(
        user.id,
        new GameOnePlayer(
            user.id,
            user.name,
            InitialParameters.PLAYERS_POSITION_X,
            [],
            user.characterNumber,
            trackLength,
            roomId
        )
    );
}
