"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkAuthMiddleware = void 0;
exports.brukerMiddleware = brukerMiddleware;
exports.adminMiddleware = adminMiddleware;
const express_1 = require("@clerk/express");
const brukere_1 = require("../data/brukere");
exports.clerkAuthMiddleware = (0, express_1.requireAuth)();
async function brukerMiddleware(req, res, next) {
    try {
        const auth = (0, express_1.getAuth)(req);
        if (!auth.userId) {
            res.status(401).json({ feil: 'Ikke autentisert' });
            return;
        }
        req.clerkUserId = auth.userId;
        let bruker = (0, brukere_1.hentBrukerMedClerkId)(auth.userId);
        if (!bruker) {
            try {
                const clerkUser = await express_1.clerkClient.users.getUser(auth.userId);
                bruker = {
                    id: crypto.randomUUID(),
                    clerkId: auth.userId,
                    brukernavn: clerkUser.username || clerkUser.firstName || 'Bruker',
                    epost: clerkUser.emailAddresses[0]?.emailAddress || '',
                    rolle: 'bruker',
                    opprettet: new Date(),
                };
            }
            catch (clerkError) {
                console.error('Clerk API feil:', clerkError);
                bruker = {
                    id: crypto.randomUUID(),
                    clerkId: auth.userId,
                    brukernavn: 'Bruker',
                    epost: '',
                    rolle: 'bruker',
                    opprettet: new Date(),
                };
            }
            (0, brukere_1.lagreBruker)(bruker);
        }
        req.brukerId = bruker.id;
        next();
    }
    catch (error) {
        console.error('Auth-feil:', error);
        res.status(401).json({ feil: 'Autentisering feilet' });
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
