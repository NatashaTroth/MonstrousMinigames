import 'reflect-metadata';

import App from './classes/App';
import { GlobalEventMessageEmitter } from './classes/GlobalEventMessageEmitter';
import DI, {
    DI_CRON_JOB_CLEANUP, DI_EVENT_MESSAGE_EMITTERS, DI_EXPRESS_PORT, DI_ROOM_NUMBER
} from './di';
import { Globals } from './enums/globals';
import { GameOneEventMessageEmitter } from './gameplay/gameOne/GameOneEventMessageEmitter';
import { GameThreeEventMessageEmitter } from './gameplay/gameThree/GameThreeEventMessageEmitter';
import { GameTwoMessageEmitter } from './gameplay/gameTwo/classes/GameTwoMessageEmitter';

function initApp(port = 5000, roomCount = 1000): App {

    // *************** DI Configs *************
    DI.register(DI_ROOM_NUMBER, { useValue: roomCount });
    DI.register(DI_EXPRESS_PORT, { useValue: port });
    DI.register(DI_CRON_JOB_CLEANUP, { useValue: Globals.CRON_JOB_CLEANUP });

    // *************** Event Messengers *******
    DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GlobalEventMessageEmitter });
    DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GameOneEventMessageEmitter });
    DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GameTwoMessageEmitter });
    DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GameThreeEventMessageEmitter });

    // *************** App ********************
    return DI.resolve(App);
}

export default initApp;
