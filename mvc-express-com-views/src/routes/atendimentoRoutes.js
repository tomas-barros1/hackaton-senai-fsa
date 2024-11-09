const express = require("express");
const router = express.Router();
const atendimentoController = require("../controllers/atendimentoController");

// Log para debug
router.use((req, res, next) => {
    console.log('Rota acessada:', req.method, req.path);
    next();
});

// Rotas da API
router.get("/api/atendimentos", atendimentoController.listarAtendimentosAPI);
router.put("/api/atendimentos/:id/status", atendimentoController.atualizarStatus);

// Rota da view
router.get("/atendimentos", atendimentoController.listarAtendimentos);

module.exports = router;
