import dotenv from 'dotenv';

import 'reflect-metadata';
import App from './classes/App';
import DI, { DI_CRON_JOB_CLEANUP, DI_EXPRESS_PORT, DI_ROOM_NUMBER } from './di';
import { Globals } from './enums/globals';

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

// *************** App ********************
const app = DI.resolve(App);
app.run();
