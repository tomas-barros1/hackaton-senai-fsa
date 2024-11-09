const Atendimento = require('../models/Atendimento');

class AtendimentoService {
  async buscarPorProtocolo(protocolo) {
    return await Atendimento.findOne({ protocolo });
  }

  async atualizarLocalizacao(protocolo, latitude, longitude) {
    return await Atendimento.findOneAndUpdate(
      { protocolo },
      { 
        localizacao: { latitude, longitude }
      },
      { new: true }
    );
  }

  async criarNovoAtendimento(dados) {
    try {
      const protocolo = this.gerarProtocolo();
      
      const novoAtendimento = new Atendimento({
        protocolo,
        numeroWhatsapp: dados.numeroWhatsapp,
        nomeUsuario: dados.nomeUsuario,
        naturezaEmergencia: dados.naturezaEmergencia,
        descricaoEmergencia: dados.descricaoEmergencia,
        status: 'Pendente'
      });

      return await novoAtendimento.save();
    } catch (error) {
      console.error('Erro ao criar atendimento:', error);
      throw error;
    }
  }

  gerarProtocolo() {
    const data = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${data}${random}`;
  }
}

module.exports = new AtendimentoService(); 