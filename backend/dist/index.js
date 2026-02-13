"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("@clerk/express");
const bingo_1 = require("./routes/bingo");
const admin_1 = require("./routes/admin");
const bruker_1 = require("./routes/bruker");
dotenv_1.default.config({ path: '.env.local' });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_2.clerkMiddleware)());
app.use('/api/bruker', bruker_1.brukerRouter);
app.use('/api/bingo', bingo_1.bingoRouter);
app.use('/api/admin', admin_1.adminRouter);
app.get('/api/helse', (_req, res) => {
    res.json({ status: 'ok', melding: 'Alpinbingo API kjører!' });
});
app.listen(PORT, () => {
    console.log(`Server kjører på port ${PORT}`);
});
