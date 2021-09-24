import EventEmitter from 'events';
import { singleton } from 'tsyringe';

@singleton()
export default class GameEventEmitter extends EventEmitter {
    public static readonly EVENT_MESSAGE_EVENT = 'event-message';

    constructor() {
        super();
    }
}
