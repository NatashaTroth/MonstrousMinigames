import { singleton } from 'tsyringe';

import ConnectionHandler from '../services/connectionHandler';

import ClearRoomCronJob from './ClearRoomCronJob';

@singleton()
class App {
    constructor(
        private readonly connectionHandler: ConnectionHandler,
        private readonly clearRoomCronJob: ClearRoomCronJob
    ) {}

    run() {
        this.connectionHandler.handle();
        if (!process.env.LOCAL_DEVELOPMENT) {
            this.clearRoomCronJob.start();
        }
    }
    shutdown() {
        this.connectionHandler.shutdown();
        if (!process.env.LOCAL_DEVELOPMENT) {
            this.clearRoomCronJob.start();
        }
    }
}

export default App;
