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

    public static emitInitialGameStateInfoUpdate(data: GameEvents.InitialGameStateInfoUpdate) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.InitialGameStateInfoUpdate, data);
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

    public static emitApproachingSkippableObstacleEvent(data: GameEvents.ApproachingSkippableObstacle) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.ApproachingSkippableObstacle, data);
    }

    public static emitPlayerHasFinishedEvent(data: GameEvents.PlayerHasFinished) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerHasFinished, data);
    }

    public static emitPlayerIsDead(data: GameEvents.PlayerIsDead) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerIsDead, data);
    }

    public static emitPlayerIsStunned(data: GameEvents.PlayerStunnedState) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerIsStunned, data);
    }

    public static emitChasersWerePushed(data: GameEvents.ChasersWerePushed) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.ChasersWerePushed, data);
    }

    public static emitPlayerHasExceededMaxNumberChaserPushes(data: GameEvents.PlayerHasExceededMaxNumberChaserPushes) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerHasExceededMaxNumberChaserPushes, data);
    }

    public static emitPlayerIsUnstunned(data: GameEvents.PlayerStunnedState) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerIsUnstunned, data);
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

    public static emitPlayerHasDisconnected(data: GameEvents.PlayerHasDisconnectedInfo) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerHasDisconnected, data);
    }

    public static emitPlayerHasReconnected(data: GameEvents.PlayerHasReconnectedInfo) {
        this.CatchFoodGameEventEmitter.emit(GameEventTypes.PlayerHasReconnected, data);
    }
}
