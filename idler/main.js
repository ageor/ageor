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

    hardly.addSystem("BiomeUi", 70);
    hardly.addSystem("BizUi", 70);
    hardly.addSystem("GeneratorUi", 70);

    hardly.addSystem("Save", 100);

    hardly.initSystems();

    hardly.load("locale/en");
    hardly.load("biomes/west_town");

    hardly.update();
    hardly.loadGame();
    
    function update() {
        hardly.update();
        
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}
