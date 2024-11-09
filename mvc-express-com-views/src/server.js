const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middlewares - ORDEM É IMPORTANTE!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurações do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

// Rotas
const atendimentoRoutes = require("./routes/atendimentoRoutes");
app.use('/', atendimentoRoutes);

// Log para debug de rotas
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Conexão MongoDB
mongoose.connect("mongodb://localhost:27017/samu_bot")
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
