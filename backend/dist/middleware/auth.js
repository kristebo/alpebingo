"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.adminMiddleware = adminMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const brukere_1 = require("../data/brukere");
const JWT_SECRET = process.env.JWT_SECRET || 'din-hemmelige-nøkkel-her';
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ feil: 'Ingen token oppgitt' });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.brukerId = decoded.brukerId;
        next();
    }
    catch (error) {
        console.error('Auth-feil:', error);
        res.status(401).json({ feil: 'Ugyldig token' });
    }
}
function adminMiddleware(req, res, next) {
    const brukerId = req.brukerId;
    if (!brukerId) {
        res.status(401).json({ feil: 'Mangler autentisering' });
        return;
    }
    const bruker = (0, brukere_1.hentBruker)(brukerId);
    if (!bruker || bruker.rolle !== 'admin') {
        res.status(403).json({ feil: 'Krever admin-tilgang' });
        return;
    }
    next();
}
