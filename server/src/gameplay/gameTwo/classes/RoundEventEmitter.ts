import EventEmitter from 'events';

export default class RoundEventEmitter extends EventEmitter {
    public static PHASE_CHANGE_EVENT = 'PHASE_CHANGE_EVENT';
    public static GAME_FINISHED_EVENT = 'GAME_FINISHED_EVENT';

    constructor() {
        super();
    }
}