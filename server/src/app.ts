import 'reflect-metadata';

import dotenv from 'dotenv';

import App from './classes/App';
import { GlobalEventMessageEmitter } from './classes/GlobalEventMessageEmitter';
import DI, {
    DI_CRON_JOB_CLEANUP, DI_EVENT_MESSAGE_EMITTERS, DI_EXPRESS_PORT, DI_ROOM_NUMBER
} from './di';
import { Globals } from './enums/globals';
import {
    CatchFoodGameEventMessageEmitter
} from './gameplay/gameOne/CatchFoodGameEventMessageEmitter';
import { GameThreeEventMessageEmitter } from './gameplay/gameThree/GameThreeEventMessageEmitter';
import { GameTwoMessageEmitter } from './gameplay/gameTwo/classes/GameTwoMessageEmitter';

// load the environment variables from the .env file
dotenv.config({
    path: '.env',
});

// *************** Env ********************
const PORT = process.env.PORT || 5000;
const roomCount: number = parseInt(`${process.env.ROOM_COUNT}`, 10) || 1000;

// *************** DI Configs *************
DI.register(DI_ROOM_NUMBER, { useValue: roomCount });
DI.register(DI_EXPRESS_PORT, { useValue: PORT });
DI.register(DI_CRON_JOB_CLEANUP, { useValue: Globals.CRON_JOB_CLEANUP });

// *************** Event Messengers *******
DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GlobalEventMessageEmitter });
DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: CatchFoodGameEventMessageEmitter });
DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GameTwoMessageEmitter });
DI.register(DI_EVENT_MESSAGE_EMITTERS, { useToken: GameThreeEventMessageEmitter });

// *************** App ********************
const app = DI.resolve(App);
app.run();
