// export class old{
//   eventEmitter :
//   public static EventEmitterInstance: EventEmitter = new EventEmitter();
//   private constructor(){
//     this.eventEmitter = require('events');

//   }
// }

// const myEmitter = new MyEmitter();
// myEmitter.on('event', (a, b) => {
//   setImmediate(() => {
//     console.log('this happens asynchronously');
//   });
// });
// myEmitter.emit('event', 'a', 'b');

import GameEventEmitter from '../../classes/GameEventEmitter';
import { GameEventTypes } from '../enums';
// import {
//     GameHasFinished, GameHasStarted, GameStateHasChanged, ObstacleReachedInfo, PlayerHasFinished, Game
// } from './interfaces/GameEvents';
import { GameEvents } from './interfaces';

export default class CatchFoodGameEventEmitter extends GameEventEmitter {
    private static CatchFoodGameEventEmitter: CatchFoodGameEventEmitter = new CatchFoodGameEventEmitter();
    private constructor() {
        super();
    }

    public static getInstance(): CatchFoodGameEventEmitter {
        return this.CatchFoodGameEventEmitter;
    }

    public static emitGameHasStartedEvent(data: GameEvents.GameHasStarted) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasStarted, data);
    }

    public static emitGameHasPausedEvent(data: GameEvents.GameStateHasChanged) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasPaused, data);
    }

    public static emitGameHasResumedEvent(data: GameEvents.GameStateHasChanged) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasResumed, data);
    }

    public static emitObstacleReachedEvent(data: GameEvents.ObstacleReachedInfo) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.ObstacleReached, data);
    }

    public static emitPlayerHasFinishedEvent(data: GameEvents.PlayerHasFinished) {
        //*
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerHasFinished, data);
    }

    public static emitGameHasFinishedEvent(data: GameEvents.GameHasFinished) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasFinished, data);
    }

    public static emitGameHasStoppedEvent(data: GameEvents.GameStateHasChanged) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasStopped, data);
    }
    public static emitAllPlayersHaveDisconnected(data: GameEvents.GameStateHasChanged) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.AllPlayersHaveDisconnected, data);
    }

    public static emitGameHasTimedOutEvent(data: GameEvents.GameHasFinished) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.GameHasTimedOut, data);
    }

    public static emitPlayerHasDisconnected(data: GameEvents.PlayerHasDisconnectedInfo) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerHasDisconnected, data);
    }

    public static emitPlayerHasReconnected(data: GameEvents.PlayerHasReconnectedInfo) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerHasReconnected, data);
    }
}
