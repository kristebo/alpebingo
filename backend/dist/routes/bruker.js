"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brukerRouter = void 0;
const express_1 = require("express");
const clerkAuth_1 = require("../middleware/clerkAuth");
const brukere_1 = require("../data/brukere");
exports.brukerRouter = (0, express_1.Router)();
exports.brukerRouter.get('/meg', clerkAuth_1.clerkAuthMiddleware, clerkAuth_1.brukerMiddleware, (req, res) => {
    const bruker = (0, brukere_1.hentBruker)(req.brukerId);
    if (!bruker) {
        res.status(404).json({ feil: 'Bruker ikke funnet' });
        return;
    }
    res.json({
        id: bruker.id,
        brukernavn: bruker.brukernavn,
        epost: bruker.epost,
        rolle: bruker.rolle,
        teamId: bruker.teamId,
    });
});
