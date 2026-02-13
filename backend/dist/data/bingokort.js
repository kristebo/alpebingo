"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bingoKort = void 0;
exports.hentKortForBruker = hentKortForBruker;
exports.lagreKort = lagreKort;
exports.hentKort = hentKort;
exports.bingoKort = new Map();
function hentKortForBruker(brukerId) {
    for (const kort of exports.bingoKort.values()) {
        if (kort.brukerId === brukerId)
            return kort;
    }
    return undefined;
}
function lagreKort(kort) {
    exports.bingoKort.set(kort.id, kort);
}
function hentKort(id) {
    return exports.bingoKort.get(id);
}
