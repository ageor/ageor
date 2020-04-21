const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
    try {
        fs.accessSync(dir);
    } catch {
        fs.mkdirSync(dir);
    }
}

["components", "systems", "prototype", "assets", "importers"].forEach(ensureDir);

function walkSync(dir, filelist = []) {

    fs.readdirSync(dir).forEach(function(file) {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });

    return filelist;
}

const components = walkSync("components").map(c => `"${c.substr(11)}"`);
const systems = walkSync("systems").map(s => `"${s.substr(8)}"`);
const prototypes = walkSync("prototype").map(p => `"${p.substr(10)}"`);
const assets = walkSync("assets").map(a => `"${a.substr(7)}"`);
const importers = walkSync("importers").map(i => `"${i}"`);

let dataTemplate = fs.readFileSync('data.template').toString();

dataTemplate = dataTemplate.replace("<components>", components);
dataTemplate = dataTemplate.replace("<systems>", systems);
dataTemplate = dataTemplate.replace("<prototypes>", prototypes);
dataTemplate = dataTemplate.replace("<assets>", assets);
dataTemplate = dataTemplate.replace("<importers>", importers);

fs.writeFileSync("data.js", dataTemplate);
