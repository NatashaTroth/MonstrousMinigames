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

import EventEmitter from "events"

export default class GameEventEmitter extends EventEmitter {
  private static EventEmitterInstance: GameEventEmitter = new GameEventEmitter();
  private constructor() {
    super();
  }

  public static getInstance() : GameEventEmitter{
    return this.EventEmitterInstance;
  }
}
