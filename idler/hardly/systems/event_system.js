import { warn } from "../logger.js"

const _eventStore = {};

function registerToEvent(eventName, callback) {
    let eventReceivers = _eventStore[eventName];

    if (!eventReceivers) {
        _eventStore[eventName] = eventReceivers = [];
    }

    eventReceivers.push(callback);
}

function fireEvent(eventName, ...args) {
    let receiver, eventReceivers = _eventStore[eventName];

    if (!eventReceivers) {
        warn(`EventSystem: Event ${eventName} has no receivers!`);

        return
    }

    for (receiver of eventReceivers) {
        receiver(...args);
    }
}

export default class EventSystem {
    constructor(hardly) {
        hardly.onEvent = registerToEvent;
        hardly.emitEvent = fireEvent;
    }
};
