let _time, _hardly;

export default class GeneratorSystem {
    static entityQuery = ["Generator"];

    constructor(hardly) {
        _hardly = hardly;
        _time = hardly.Time;
    }

    added(e) {
        let gen = e.Generator;

        gen.owned = 0;
        gen.managed = false;
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
