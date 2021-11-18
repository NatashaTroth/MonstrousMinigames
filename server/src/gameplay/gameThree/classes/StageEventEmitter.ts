import EventEmitter from 'events';

export default class StageEventEmitter extends EventEmitter {
    private static instance: StageEventEmitter;
    public static STAGE_CHANGE_EVENT = 'STAGE_CHANGE_EVENT';
    public static NEW_ROUND_EVENT = 'NEW_ROUND_EVENT';

    private constructor() {
        super();
    }

    public static getInstance(newInstance = false): StageEventEmitter {
        if (!StageEventEmitter.instance || newInstance) {
            StageEventEmitter.instance = new StageEventEmitter();
        }

        return StageEventEmitter.instance;
    }
}
