import EventEmitter from "events";

class IntervalTimer {
  enabled = false;
  speed = 1;
  private timer: NodeJS.Timer;
  private time = 0;
  private timeEventEmitter = new EventEmitter();

  private static TIME_UPDATE = "time_update";

  constructor() {
    this.timer = setInterval(() => {
      this.emit();
    }, 200);
  }

  private emit() {
    if (this.enabled) {
      this.time = this.time + this.speed * 100;
      this.timeEventEmitter.emit(IntervalTimer.TIME_UPDATE, {
        time: this.time,
      });
    }
  }

  setTime = (t: number) => {
    console.log("Timer time set: ", t);
    this.time = t;
  };

  setEnabled = (e: boolean) => {
    console.log("Timer enabled: ", e);
    this.enabled = e;
  };

  setSpeed = (s: number) => {
    console.log("Timer speed: ", s);
    this.speed = s;
  };

  setListener = async (
    listener: ({ time }: { time: number }) => Promise<void>
  ) => {
    this.timeEventEmitter.removeAllListeners();
    this.timeEventEmitter.addListener(IntervalTimer.TIME_UPDATE, listener);
  };
}
declare global {
  var __intervalTimer__: IntervalTimer;
}
let intervalTimer: IntervalTimer;

if (!global.__intervalTimer__) {
  console.log("New interval timer");
  global.__intervalTimer__ = new IntervalTimer();
}
intervalTimer = global.__intervalTimer__;

export { intervalTimer };
