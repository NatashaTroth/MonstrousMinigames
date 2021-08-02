import { container as DI } from 'tsyringe';

export const DI_ROOM_NUMBER = Symbol('room-number');
export const DI_EXPRESS_PORT = Symbol('port');
export const DI_CRON_JOB_CLEANUP = Symbol('cron-job-cleanup');

export default DI;
