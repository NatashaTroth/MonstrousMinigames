import { GameOneMsgType } from '../../../src/gameplay/gameOne/enums';
import { IMessage } from '../../../src/interfaces/messages';
import { users } from '../mockData';

export const pushChasersMessage: IMessage = {
    type: GameOneMsgType.CHASERS_WERE_PUSHED,
    userId: users[0].id,
};
