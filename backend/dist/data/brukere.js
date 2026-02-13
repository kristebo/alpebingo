"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teams = exports.brukere = void 0;
exports.hentBrukerMedEpost = hentBrukerMedEpost;
exports.hentBruker = hentBruker;
exports.lagreBruker = lagreBruker;
exports.hentAlleBrukere = hentAlleBrukere;
exports.hentTeam = hentTeam;
exports.hentAlleTeams = hentAlleTeams;
exports.lagreTeam = lagreTeam;
exports.slettTeam = slettTeam;
exports.brukere = new Map();
exports.teams = new Map();
function hentBrukerMedEpost(epost) {
    for (const bruker of exports.brukere.values()) {
        if (bruker.epost === epost)
            return bruker;
    }
    return undefined;
}
function hentBruker(id) {
    return exports.brukere.get(id);
}
function lagreBruker(bruker) {
    exports.brukere.set(bruker.id, bruker);
}
function hentAlleBrukere() {
    return Array.from(exports.brukere.values());
}
function hentTeam(id) {
    return exports.teams.get(id);
}
function hentAlleTeams() {
    return Array.from(exports.teams.values());
}
function lagreTeam(team) {
    exports.teams.set(team.id, team);
}
function slettTeam(id) {
    return exports.teams.delete(id);
}
