import { CronJob } from 'cron';
import { inject, singleton } from 'tsyringe';
import { DI_CRON_JOB_CLEANUP } from '../di';
import RoomService from '../services/roomService';

@singleton()
class ClearRoomCronJob {
    private readonly cronJob: CronJob;
    private roomCount: number;

    constructor(
        @inject(DI_CRON_JOB_CLEANUP)
        private readonly cronJobCleanup: string,
        private readonly roomServer: RoomService
    ) {
        this.roomCount = this.roomServer.roomCodes.length;
        this.cronJob = new CronJob(
            this.cronJobCleanup,
            () => {
                try {
                    this.roomCount = this.roomServer.roomCodes.length;
                    this.roomServer.cleanupRooms();
                    if (this.roomServer.roomCodes.length - this.roomCount > 0)
                        console.info(`${this.roomServer.roomCodes.length - this.roomCount} room(s) cleared`);
                } catch (e) {
                    console.error(e);
                }
            },
            null,
            true
        );
    }

    start() {
        this.cronJob.start();
    }
}

export default ClearRoomCronJob;
