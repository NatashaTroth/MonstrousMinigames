import EventEmitter from 'events';

export default class RoundEventEmitter extends EventEmitter {
    private static instance: RoundEventEmitter;
    public static PHASE_CHANGE_EVENT = 'PHASE_CHANGE_EVENT';

    private constructor() {
        super();
    }

    public static getInstance(): RoundEventEmitter {
        if (!RoundEventEmitter.instance) {
            RoundEventEmitter.instance = new RoundEventEmitter();
        }
        return RoundEventEmitter.instance;
    }


}