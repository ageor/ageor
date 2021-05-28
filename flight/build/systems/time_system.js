const Time = {
  current: 0,
  delta: 0,
};

let last = 0;

export default class TimeSytem {
  update() {
    Time.current = performance.now();
    Time.delta = Time.current - last;

    last = Time.current;
  }
};

function currentTime() {
  return Time.current;
}

function deltaTime() {
  return Time.delta;
}

export { currentTime, deltaTime };
