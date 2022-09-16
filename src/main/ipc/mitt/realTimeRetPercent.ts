import { EventEmitter } from "node:events";

function mittRealTime() {
  class MyMitt extends EventEmitter {
    constructor() {
      super();
    }

    sub(eventName: string, fn: (...arg) => void) {
      this.on(eventName, fn);
    }

    pub(eventName: string, ...args: any) {
      this.emit(eventName, ...args);
    }

    remove(eventName: string) {
      return this.removeListener(eventName, () => {});
    }

    removeAll() {
      return this.removeAllListeners();
    }
  }

  const mitt = new MyMitt();

  return mitt;
}

export default mittRealTime();
