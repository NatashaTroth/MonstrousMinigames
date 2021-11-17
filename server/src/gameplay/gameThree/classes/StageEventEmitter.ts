import EventEmitter from 'events';

export default class StageEventEmitter extends EventEmitter {
    private static instance: StageEventEmitter;
    public static STAGE_CHANGE_EVENT = 'STAGE_CHANGE_EVENT';

    private constructor() {
        super();
    }

    public static getInstance(): StageEventEmitter {
        if (!StageEventEmitter.instance) {
            StageEventEmitter.instance = new StageEventEmitter();
        }

        return StageEventEmitter.instance;
    }
}
