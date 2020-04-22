import { err } from "../logger.js"

let _hardly;
let _currentLanguage;
const _localizations = [];

export default class LocalizationSystem {
    static entityQuery = ["TextSet"];

    constructor(hardly) {
        _hardly = hardly;
    }

    added(e) {
        _localizations.push(e.TextSet);

        if (!_currentLanguage) {
            _currentLanguage = e.TextSet.language;
            _hardly.L10N = e.TextSet.texts;
        }
    }

    removed(e) {
        err(`LocalizationSystem: Removed language ${e.TextSet.language}`);
    }
};
