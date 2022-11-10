import EventEmitter from "events";

let enabled = true;
let time = 0;
let speed = 1;

export const timeEventEmitter = new EventEmitter();

setInterval(() => {
  if (enabled) {
    time = time + speed * 100;
    timeEventEmitter.emit("event", { time: time });
  }
}, 100);

export const setTimerEnabled = (e: boolean) => {
  console.log("Timer enabled: ", e);
  enabled = e;
};
export const setTimerSpeed = (s: number) => {
  console.log("Timer speed: ", s);
  speed = s;
};
