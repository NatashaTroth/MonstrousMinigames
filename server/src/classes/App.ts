import { singleton } from 'tsyringe';
import ClearRoomCronJob from './ClearRoomCronJob';
import ConnectionHandler from '../services/connectionHandler';

@singleton()
class App {
    constructor(
        private readonly connectionHandler: ConnectionHandler,
        private readonly clearRoomCronJob: ClearRoomCronJob
    ) { }

    run() {
        this.connectionHandler.handle();
        if (!process.env.LOCAL_DEVELOPMENT) {
            this.clearRoomCronJob.start();
        }
    }
}

export default App;
