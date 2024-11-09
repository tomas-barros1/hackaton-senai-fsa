const express = require("express");
const router = express.Router();
const atendimentoController = require("../controllers/atendimentoController");

router.get("/atendimentos", atendimentoController.listarAtendimentos);
router.get("/api/atendimentos", atendimentoController.listarAtendimentosAPI);
router.get("/api/atendimentos/:id/localizacao", atendimentoController.getLocalizacao);

module.exports = router;
