"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const brukere_1 = require("../data/brukere");
exports.authRouter = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'din-hemmelige-nøkkel-her';
// Registrer ny bruker
exports.authRouter.post('/registrer', async (req, res) => {
    try {
        const { brukernavn, epost, passord } = req.body;
        if (!brukernavn || !epost || !passord) {
            res.status(400).json({ feil: 'Alle felt er påkrevd' });
            return;
        }
        // Sjekk om bruker allerede eksisterer
        const eksisterendeBruker = (0, brukere_1.hentBrukerMedEpost)(epost);
        if (eksisterendeBruker) {
            res.status(400).json({ feil: 'Epost er allerede registrert' });
            return;
        }
        // Hash passord
        const hashetPassord = await bcryptjs_1.default.hash(passord, 10);
        // Opprett bruker
        const nyBruker = {
            id: crypto.randomUUID(),
            brukernavn,
            epost,
            passord: hashetPassord,
            rolle: 'bruker',
            opprettet: new Date(),
        };
        (0, brukere_1.lagreBruker)(nyBruker);
        // Generer JWT token
        const token = jsonwebtoken_1.default.sign({ brukerId: nyBruker.id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            bruker: {
                id: nyBruker.id,
                brukernavn: nyBruker.brukernavn,
                epost: nyBruker.epost,
                rolle: nyBruker.rolle,
            },
        });
    }
    catch (error) {
        console.error('Registrering feilet:', error);
        res.status(500).json({ feil: 'Serverfeil ved registrering' });
    }
});
// Logg inn
exports.authRouter.post('/logg-inn', async (req, res) => {
    try {
        const { epost, passord } = req.body;
        if (!epost || !passord) {
            res.status(400).json({ feil: 'Epost og passord er påkrevd' });
            return;
        }
        // Finn bruker
        const bruker = (0, brukere_1.hentBrukerMedEpost)(epost);
        if (!bruker || !bruker.passord) {
            res.status(401).json({ feil: 'Ugyldig epost eller passord' });
            return;
        }
        // Sjekk passord
        const passordMatch = await bcryptjs_1.default.compare(passord, bruker.passord);
        if (!passordMatch) {
            res.status(401).json({ feil: 'Ugyldig epost eller passord' });
            return;
        }
        // Generer JWT token
        const token = jsonwebtoken_1.default.sign({ brukerId: bruker.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            bruker: {
                id: bruker.id,
                brukernavn: bruker.brukernavn,
                epost: bruker.epost,
                rolle: bruker.rolle,
            },
        });
    }
    catch (error) {
        console.error('Innlogging feilet:', error);
        res.status(500).json({ feil: 'Serverfeil ved innlogging' });
    }
});
