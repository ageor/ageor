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

function buildExport(dir) {
  const files = walkSync(dir).map(p => {
    const filePathArr = `${p.substr(dir.length + 1)}`.split('/');
    return filePathArr[filePathArr.length - 1];
  });

  const names = files.map(f => {
    return f.split('.')[0].split('_').map(s => s[0].toUpperCase() + s.slice(1)).join('');
  });

  const paths = walkSync(dir).map(c => `"./${dir}/${c.substr(dir.length + 1)}"`);

  const imports = [];
  for (let i = 0; i < names.length; i++) {
    imports.push(`import ${names[i]} from ${paths[i]};`);
  }

  if (names.length) {
    return imports.join('\n') + '\n\nexport {\n    ' + names.join(',\n    ') + ',\n};\n';
  } else {
    return 'export {};\n';
  }
}

fs.writeFileSync('component_imports.js', buildExport('components'));
fs.writeFileSync('system_imports.js', buildExport('systems'));
fs.writeFileSync('importer_imports.js', buildExport('importers'));

const proto = walkSync("prototype");
let protoBuild = "const prototypes = {};\n\n";

for (let p of proto) {
  const fileData = fs.readFileSync(p).toString();
  const prototypeName = p.split('.')[0].slice(p.indexOf('/') + 1);

  protoBuild += `prototypes["${prototypeName}"] = ${fileData};\n\n`;
}

protoBuild += "Object.freeze(prototypes);\n\nexport default prototypes;\n";

fs.writeFileSync('prototypes_build.js', protoBuild);

const assets = walkSync("assets").map(a => `"${a.substr(7)}"`);

let dataFile = "";
dataFile += `const Assets = Object.freeze([${assets}]);\n\n`;
dataFile += "export { Assets };\n";

fs.writeFileSync("data.js", dataFile);
