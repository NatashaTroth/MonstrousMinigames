import EventEmitter from 'events';

import { GameEventTypes } from './GameEventTypes';

export default class GameEventEmitter extends EventEmitter {
    private static GameEventEmitter: GameEventEmitter = new GameEventEmitter();
    private constructor() {
        super();
    }

    public static getInstance(): GameEventEmitter {
        return this.GameEventEmitter;
    }

    public static emitPauseResumeEvent() {
        this.GameEventEmitter.emit(GameEventTypes.PauseResume);
    }

    public static emitStopEvent() {
        this.GameEventEmitter.emit(GameEventTypes.Stop);
    }
}
