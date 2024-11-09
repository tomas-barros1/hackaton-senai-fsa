const Atendimento = require('../models/Atendimento');
const mongoose = require('mongoose');

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

exports.atualizarStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Tentando atualizar atendimento:', { id, status });

    try {
        // Verifica se o ID é válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('ID inválido:', id);
            return res.status(400).json({ error: "ID inválido" });
        }

        // Tenta encontrar e atualizar o atendimento
        const atendimento = await Atendimento.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true, runValidators: true }
        );

        console.log('Resultado da busca:', atendimento);

        if (!atendimento) {
            console.log('Atendimento não encontrado');
            return res.status(404).json({ error: "Atendimento não encontrado" });
        }

        console.log('Atendimento atualizado com sucesso:', atendimento);
        res.json(atendimento);

    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({ error: error.message });
    }
};
