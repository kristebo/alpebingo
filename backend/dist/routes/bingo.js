"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bingoRouter = void 0;
const express_1 = require("express");
const clerkAuth_1 = require("../middleware/clerkAuth");
const bingokort_1 = require("../data/bingokort");
const hendelser_1 = require("../data/hendelser");
exports.bingoRouter = (0, express_1.Router)();
exports.bingoRouter.get('/hendelser', (_req, res) => {
    res.json((0, hendelser_1.hentAktiveHendelser)());
});
exports.bingoRouter.get('/kategorier', (_req, res) => {
    res.json((0, hendelser_1.hentAlleKategorier)());
});
exports.bingoRouter.get('/kort', clerkAuth_1.clerkAuthMiddleware, clerkAuth_1.brukerMiddleware, (req, res) => {
    const brukerId = req.brukerId;
    let kort = (0, bingokort_1.hentKortForBruker)(brukerId);
    if (!kort) {
        kort = (0, hendelser_1.genererTilfeldigKort)(brukerId);
        (0, bingokort_1.lagreKort)(kort);
    }
    res.json(kort);
});
exports.bingoRouter.post('/kort/nytt', clerkAuth_1.clerkAuthMiddleware, clerkAuth_1.brukerMiddleware, (req, res) => {
    const brukerId = req.brukerId;
    const kort = (0, hendelser_1.genererTilfeldigKort)(brukerId);
    (0, bingokort_1.lagreKort)(kort);
    res.json(kort);
});
exports.bingoRouter.post('/kort/:kortId/kryss/:feltId', clerkAuth_1.clerkAuthMiddleware, clerkAuth_1.brukerMiddleware, (req, res) => {
    const { kortId, feltId } = req.params;
    const kort = (0, bingokort_1.hentKort)(kortId);
    if (!kort) {
        res.status(404).json({ feil: 'Kort ikke funnet' });
        return;
    }
    if (kort.brukerId !== req.brukerId) {
        res.status(403).json({ feil: 'Ikke tilgang til dette kortet' });
        return;
    }
    if (!kort.kryssedeFelt.includes(feltId)) {
        kort.kryssedeFelt.push(feltId);
        (0, bingokort_1.lagreKort)(kort);
    }
    const harBingo = sjekkBingo(kort.felt, kort.kryssedeFelt);
    res.json({ kort, harBingo });
});
function sjekkBingo(felt, kryssede) {
    for (let rad = 0; rad < 5; rad++) {
        if (felt[rad].every(f => kryssede.includes(f.id)))
            return true;
    }
    for (let kol = 0; kol < 5; kol++) {
        if (felt.every(rad => kryssede.includes(rad[kol].id)))
            return true;
    }
    if (felt.every((rad, i) => kryssede.includes(rad[i].id)))
        return true;
    if (felt.every((rad, i) => kryssede.includes(rad[4 - i].id)))
        return true;
    return false;
}
