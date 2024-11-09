const Atendimento = require('../models/Atendimento');

exports.listarAtendimentos = async (req, res) => {
  try {
    const atendimentos = await Atendimento.find().sort({ criadoEm: -1 });
    res.render("atendimentos", { atendimentos });
  } catch (error) {
    res.status(500).send("Erro ao buscar atendimentos: " + error.message);
  }
};

exports.listarAtendimentosAPI = async (req, res) => {
  try {
    const atendimentos = await Atendimento.find().sort({ criadoEm: -1 });
    res.json(atendimentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar atendimentos: " + error.message });
  }
};

exports.getLocalizacao = async (req, res) => {
  try {
    const atendimento = await Atendimento.findById(req.params.id);
    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado" });
    }
    res.json({
      latitude: atendimento.latitude,
      longitude: atendimento.longitude
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar localização: " + error.message });
  }
};
