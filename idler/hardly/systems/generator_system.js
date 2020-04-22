export default class GeneratorSystem {
    static entityQuery = ["Generator"];

    added(e) {
        let gen = e.Generator;

        gen.owned = 0;
    }

    removed(e) {
        err(`GeneratorSystem: Removed generator ${e.meta.name}`);
    }
};
