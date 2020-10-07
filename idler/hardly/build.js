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

const prototypes = walkSync("prototype").map(p => `"${p.substr(10)}"`);
const assets = walkSync("assets").map(a => `"${a.substr(7)}"`);

// Flexperiment
function buildExport(dir) {
    const files = walkSync(dir).map(p => {
        const filePathArr = `${p.substr(dir.length + 1)}`.split('/');
        return filePathArr[filePathArr.length - 1];
    });

    const names = files.map(f => {
        const name = f.split('.')[0].split('_').map(s => s[0].toUpperCase() + s.slice(1)).join('');
        return name;
    });

    const paths = walkSync(dir).map(c => `"./${dir}/${c.substr(dir.length + 1)}"`);

    const imports = [];
    for (let i = 0; i < names.length; i++) {
        imports.push(`import ${names[i]} from ${paths[i]};`);
    }

    return imports.join('\n') + '\n\nexport {\n    ' + names.join(',\n    ') + ',\n};\n';
}

fs.writeFileSync('component_imports.js', buildExport('components'));
fs.writeFileSync('system_imports.js', buildExport('systems'));
fs.writeFileSync('importer_imports.js', buildExport('importers'));
//

let dataTemplate = fs.readFileSync('data.template').toString();

dataTemplate = dataTemplate.replace("<prototypes>", prototypes);
dataTemplate = dataTemplate.replace("<assets>", assets);

fs.writeFileSync("data.js", dataTemplate);
