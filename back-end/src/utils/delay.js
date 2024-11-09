// Função para criar um delay/pausa na execução
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = delay; 