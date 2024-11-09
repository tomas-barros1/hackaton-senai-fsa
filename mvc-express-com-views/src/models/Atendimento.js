const mongoose = require("mongoose");

const atendimentoSchema = new mongoose.Schema({
  protocolo: {
    type: String,
    required: true,
    unique: true,
  },
  numeroWhatsapp: {
    type: String,
    required: true,
  },
  nomeUsuario: {
    type: String,
    required: true,
  },
  naturezaEmergencia: {
    type: String,
    enum: ["Acidente", "Mal súbito", "Gestante", "Queda", "Agressão", "Outros"],
    required: true,
  },
  descricaoEmergencia: {
    type: String,
    required: true,
  },
  localizacao: {
    latitude: Number,
    longitude: Number,
  },
  status: {
    type: String,
    enum: ["Pendente", "Em Atendimento", "Finalizado"],
    default: "Pendente",
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Atendimento", atendimentoSchema);
