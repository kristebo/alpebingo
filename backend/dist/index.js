"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bingo_1 = require("./routes/bingo");
const admin_1 = require("./routes/admin");
const bruker_1 = require("./routes/bruker");
const auth_1 = require("./routes/auth");
// Load environment variables (try .env.local first, then .env)
dotenv_1.default.config({ path: '.env' });
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.authRouter);
app.use('/api/bruker', bruker_1.brukerRouter);
app.use('/api/bingo', bingo_1.bingoRouter);
app.use('/api/admin', admin_1.adminRouter);
app.get('/api/helse', (_req, res) => {
    res.json({ status: 'ok', melding: 'Alpinbingo API kjører!' });
});
app.listen(PORT, () => {
    console.log(`Server kjører på port ${PORT}`);
});
