let logging = true;

function err(message) {
    if (!logging) return;

    console.error(message);
}

function log(message) {
    if (!logging) return;

    console.log(message);
}

function warn(message) {
    if (!logging) return;

    console.log(message);
}

export { err, warn, log }
