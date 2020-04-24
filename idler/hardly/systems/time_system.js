const _time = {
    now: 0,
    delta: 0,
    frame: 0,
}

export default class TimeSystem {
    constructor(hardly) {
        hardly.Time = _time;
    }

    init() {
        _time.now = _time.delta = _time.frame = 0;
    }

    update() {
        let now = performance.now();

        _time.delta = now - _time.now;
        _time.now = now;
        _time.frame += 1;
    }
};
