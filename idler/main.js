// import { ECS, Component } from "./hardly/ecs.js";
import Hardly from "./hardly/hardly.js";

export default async function init() {
    const hardly = new Hardly();
    await hardly.init();

    hardly.addSystem("Time", 1);
    hardly.addSystem("Localization", 2);

    hardly.addSystem("Biome", 50);
    hardly.addSystem("Biz", 51);
    hardly.addSystem("Generator", 52);

    hardly.initSystems();

    hardly.load("locale/en");
    hardly.load("biomes/west_town");

    window.dbg = hardly;

    function update() {
        hardly.update();

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}
