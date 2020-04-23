import Hardly from "./hardly/hardly.js";

export default async function init() {
    const hardly = new Hardly();

    window.dbg = hardly;

    await hardly.init();

    hardly.addSystem("Time", 1);
    hardly.addSystem("Localization", 2);
    hardly.addSystem("Event", 3);

    hardly.addSystem("Biome", 50);
    hardly.addSystem("Biz", 51);
    hardly.addSystem("Generator", 52);

    hardly.addSystem("BiomeUI", 70);
    hardly.addSystem("BizUI", 70);
    hardly.addSystem("GeneratorUI", 70);

    hardly.initSystems();

    hardly.load("locale/en");
    hardly.load("biomes/west_town");

    function update() {
        hardly.update();

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}
