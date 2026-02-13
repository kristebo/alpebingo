"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const brukere_1 = require("../data/brukere");
const hendelser_1 = require("../data/hendelser");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.use(auth_1.authMiddleware);
exports.adminRouter.use(auth_1.adminMiddleware);
exports.adminRouter.get('/brukere', (_req, res) => {
    const brukere = (0, brukere_1.hentAlleBrukere)().map(b => ({
        id: b.id,
        brukernavn: b.brukernavn,
        epost: b.epost,
        rolle: b.rolle,
        teamId: b.teamId,
        opprettet: b.opprettet,
    }));
    res.json(brukere);
});
exports.adminRouter.put('/brukere/:brukerId/team', (req, res) => {
    const { brukerId } = req.params;
    const { teamId } = req.body;
    const bruker = (0, brukere_1.hentBruker)(brukerId);
    if (!bruker) {
        res.status(404).json({ feil: 'Bruker ikke funnet' });
        return;
    }
    if (teamId && !(0, brukere_1.hentTeam)(teamId)) {
        res.status(400).json({ feil: 'Team finnes ikke' });
        return;
    }
    bruker.teamId = teamId || undefined;
    (0, brukere_1.lagreBruker)(bruker);
    res.json({ id: bruker.id, brukernavn: bruker.brukernavn, teamId: bruker.teamId });
});
exports.adminRouter.put('/brukere/:brukerId/rolle', (req, res) => {
    const { brukerId } = req.params;
    const { rolle } = req.body;
    if (rolle !== 'bruker' && rolle !== 'admin') {
        res.status(400).json({ feil: 'Ugyldig rolle' });
        return;
    }
    const bruker = (0, brukere_1.hentBruker)(brukerId);
    if (!bruker) {
        res.status(404).json({ feil: 'Bruker ikke funnet' });
        return;
    }
    bruker.rolle = rolle;
    (0, brukere_1.lagreBruker)(bruker);
    res.json({ id: bruker.id, brukernavn: bruker.brukernavn, rolle: bruker.rolle });
});
exports.adminRouter.get('/teams', (_req, res) => {
    res.json((0, brukere_1.hentAlleTeams)());
});
exports.adminRouter.post('/teams', (req, res) => {
    const { navn } = req.body;
    if (!navn) {
        res.status(400).json({ feil: 'Navn er påkrevd' });
        return;
    }
    const team = {
        id: crypto.randomUUID(),
        navn,
        opprettet: new Date(),
    };
    (0, brukere_1.lagreTeam)(team);
    res.status(201).json(team);
});
exports.adminRouter.put('/teams/:teamId', (req, res) => {
    const { teamId } = req.params;
    const { navn } = req.body;
    const team = (0, brukere_1.hentTeam)(teamId);
    if (!team) {
        res.status(404).json({ feil: 'Team ikke funnet' });
        return;
    }
    if (navn)
        team.navn = navn;
    (0, brukere_1.lagreTeam)(team);
    res.json(team);
});
exports.adminRouter.delete('/teams/:teamId', (req, res) => {
    const { teamId } = req.params;
    if (!(0, brukere_1.slettTeam)(teamId)) {
        res.status(404).json({ feil: 'Team ikke funnet' });
        return;
    }
    res.status(204).send();
});
exports.adminRouter.get('/kategorier', (_req, res) => {
    res.json((0, hendelser_1.hentAlleKategorier)());
});
exports.adminRouter.post('/kategorier', (req, res) => {
    const { navn } = req.body;
    if (!navn) {
        res.status(400).json({ feil: 'Navn er påkrevd' });
        return;
    }
    const id = navn.toLowerCase().replace(/\s+/g, '-');
    const kategori = {
        id,
        navn,
        opprettet: new Date(),
    };
    (0, hendelser_1.lagreKategori)(kategori);
    res.status(201).json(kategori);
});
exports.adminRouter.put('/kategorier/:kategoriId', (req, res) => {
    const { kategoriId } = req.params;
    const { navn } = req.body;
    const kategori = (0, hendelser_1.hentKategori)(kategoriId);
    if (!kategori) {
        res.status(404).json({ feil: 'Kategori ikke funnet' });
        return;
    }
    if (navn)
        kategori.navn = navn;
    (0, hendelser_1.lagreKategori)(kategori);
    res.json(kategori);
});
exports.adminRouter.delete('/kategorier/:kategoriId', (req, res) => {
    const { kategoriId } = req.params;
    if (!(0, hendelser_1.slettKategori)(kategoriId)) {
        res.status(404).json({ feil: 'Kategori ikke funnet' });
        return;
    }
    res.status(204).send();
});
exports.adminRouter.get('/hendelser', (_req, res) => {
    res.json((0, hendelser_1.hentAlleHendelser)());
});
exports.adminRouter.post('/hendelser', (req, res) => {
    const { tekst, kategoriId, aktiv = true } = req.body;
    if (!tekst || !kategoriId) {
        res.status(400).json({ feil: 'Tekst og kategoriId er påkrevd' });
        return;
    }
    if (!(0, hendelser_1.hentKategori)(kategoriId)) {
        res.status(400).json({ feil: 'Kategori finnes ikke' });
        return;
    }
    const hendelse = {
        id: crypto.randomUUID(),
        tekst,
        kategoriId,
        aktiv,
        opprettet: new Date(),
    };
    (0, hendelser_1.lagreHendelse)(hendelse);
    res.status(201).json(hendelse);
});
exports.adminRouter.put('/hendelser/:hendelseId', (req, res) => {
    const { hendelseId } = req.params;
    const { tekst, kategoriId, aktiv } = req.body;
    const hendelse = (0, hendelser_1.hentHendelse)(hendelseId);
    if (!hendelse) {
        res.status(404).json({ feil: 'Hendelse ikke funnet' });
        return;
    }
    if (tekst)
        hendelse.tekst = tekst;
    if (kategoriId) {
        if (!(0, hendelser_1.hentKategori)(kategoriId)) {
            res.status(400).json({ feil: 'Kategori finnes ikke' });
            return;
        }
        hendelse.kategoriId = kategoriId;
    }
    if (typeof aktiv === 'boolean')
        hendelse.aktiv = aktiv;
    (0, hendelser_1.lagreHendelse)(hendelse);
    res.json(hendelse);
});
exports.adminRouter.delete('/hendelser/:hendelseId', (req, res) => {
    const { hendelseId } = req.params;
    if (!(0, hendelser_1.slettHendelse)(hendelseId)) {
        res.status(404).json({ feil: 'Hendelse ikke funnet' });
        return;
    }
    res.status(204).send();
});
