const fs = require('fs'),
      http = require('http'),
      path = require('path'),
      childProcess = require('child_process');

http.createServer(function (req, res) {
  let filePath = req.url;

  if (filePath === '/') {
    filePath = '/index.html';
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;      
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
  }

  fs.readFile(__dirname + filePath, function (err, data) {
    if (err) {
      console.log('[404] Not found: ' + filePath);

      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }

    console.log('[200] ' + filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(8998);

console.log('Building...');
runScript('./build.js', function (err) {
  if (err) throw err;

  console.log('Build finished.');
});

console.log('Serving http://localhost:8998');

function runScript(scriptPath, callback) {
  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;

  const process = childProcess.fork(scriptPath, { cwd: __dirname + '/hardly/' });

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  // execute the callback once the process has finished running
  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    const err = code === 0 ? null : new Error('exit code ' + code);
    callback(err);
  });
}

function triggerBuild(type = '') {
  return function(eventType, filename) {
    if (type !== '' && eventType !== type) return;

    console.log(`[${eventType}] '${filename}' triggered build...`);

    runScript('./build.js', function (err) {
      if (err) throw err;

      console.log('Build finished.');
    });
  }
}

fs.watch('./hardly/components/', { recursive: true }, triggerBuild('rename'));
fs.watch('./hardly/systems/', { recursive: true }, triggerBuild('rename'));
fs.watch('./hardly/prototype/', { recursive: true }, triggerBuild());
fs.watch('./hardly/importers/', { recursive: true }, triggerBuild('rename'));
