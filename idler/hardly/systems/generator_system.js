let _time, _hardly;

const _query = ["Generator"];

export default class GeneratorSystem {
    static get entityQuery() { return _query; }

    constructor(hardly) {
        _hardly = hardly;
        _time = hardly.Time;
    }

    added(e) {
        _hardly.onEvent("event_loadGame", function(gameTime, timeSkip) {
            const cash = e.Generator.forward(gameTime, timeSkip, _hardly.Time.now);

            _hardly.emitEvent(
                "event_capitalChange",
                e.Generator.biomeTag,
                cash
            );
        });
    }

    removed(e) {
        err(`GeneratorSystem: Removed generator ${e.meta.name}`);
    }

    update() {
        let e, gen;

        for (e of this.entities) {
            gen = e.Generator;
            
            if (!gen.running) continue;

            if (gen.progress >= 1) {
                gen.progress = 0;
                gen.running = false;

                _hardly.emitEvent("event_capitalChange", gen.biomeTag, gen.calculateProduction());

                if (gen.managed) gen.start(_time.now);
            }

            gen.progress = ((_time.now - gen.startTime) / 1000) / gen.baseCycle;
        }
    }
};
