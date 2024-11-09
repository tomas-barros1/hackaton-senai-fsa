const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const connectDB = require('./config/database');
const AtendimentoService = require('./services/AtendimentoService');
const delay = require('./utils/delay');

// Conecta ao MongoDB
connectDB();

const client = new Client();
const userStates = new Map();
let currentProtocolo = null;

// Evento para gerar o QR Code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    console.log('QR Code gerado! Escaneie-o com seu WhatsApp.');
});

// Evento quando o cliente está pronto
client.on('ready', () => {
    console.log('Cliente WhatsApp está pronto!');
});

// Inicializa o cliente
client.initialize();

const MENU_INICIAL = `
Bem-vindo ao atendimento SAMU!
Por favor, escolha uma opção:

1 - Já tenho um protocolo
2 - Preciso de atendimento
3 - Sair
`;

const MENU_NATUREZA = `
Qual a natureza da emergência?

1 - Acidente
2 - Mal súbito
3 - Gestante
4 - Queda
5 - Agressão
6 - Outros
`;

client.on('message', async msg => {
    if (!msg.from.endsWith('@c.us')) return;

    const userState = userStates.get(msg.from) || { step: 'INICIO' };
    const contact = await msg.getContact();
    const resposta = msg.body.trim();

    try {
        switch (userState.step) {
            case 'INICIO':
                await delay(1000);
                await msg.reply(`Olá ${contact.pushname}!\n${MENU_INICIAL}`);
                userState.step = 'MENU_PRINCIPAL';
                break;

            case 'MENU_PRINCIPAL':
                switch (resposta) {
                    case '1':
                        await msg.reply('Por favor, digite seu número de protocolo:');
                        userState.step = 'VERIFICAR_PROTOCOLO';
                        break;
                    case '2':
                        await msg.reply(MENU_NATUREZA);
                        userState.step = 'NATUREZA_EMERGENCIA';
                        break;
                    case '3':
                        await msg.reply('Atendimento finalizado. Se precisar, entre em contato novamente.');
                        userStates.delete(msg.from);
                        return;
                    default:
                        await msg.reply('Opção inválida. ' + MENU_INICIAL);
                        break;
                }
                break;

            case 'VERIFICAR_PROTOCOLO':
                const atendimento = await AtendimentoService.buscarPorProtocolo(resposta);
                if (!atendimento) {
                    await msg.reply('Protocolo não encontrado. Por favor, verifique o número.');
                    return;
                }

                await msg.reply('Ok! Agora, envie sua localização: ');
                userState.step = 'LOCALIZACAO';
                currentProtocolo = atendimento.protocolo;
                break;

            case 'NATUREZA_EMERGENCIA':
                const naturezas = {
                    '1': 'Acidente',
                    '2': 'Mal súbito',
                    '3': 'Gestante',
                    '4': 'Queda',
                    '5': 'Agressão',
                    '6': 'Outros'
                };

                if (naturezas[resposta]) {
                    userState.naturezaEmergencia = naturezas[resposta];
                    await msg.reply('Descreva brevemente a situação:');
                    userState.step = 'DESCRICAO_EMERGENCIA';
                } else {
                    await msg.reply('Opção inválida.\n' + MENU_NATUREZA);
                }
                break;

            case 'DESCRICAO_EMERGENCIA':
                try {
                    if (!resposta || resposta.trim().length === 0) {
                        await msg.reply('Por favor, forneça uma descrição da emergência.');
                        break;
                    }

                    if (!userState.naturezaEmergencia) {
                        await msg.reply('Houve um erro no processo. Vamos recomeçar.');
                        userState.step = 'INICIO';
                        break;
                    }

                    const novoAtendimento = await AtendimentoService.criarNovoAtendimento({
                        numeroWhatsapp: msg.from,
                        nomeUsuario: contact.pushname || 'Não identificado',
                        naturezaEmergencia: userState.naturezaEmergencia,
                        descricaoEmergencia: resposta
                    });

                    currentProtocolo = novoAtendimento.protocolo;
                    await msg.reply(
                        `Protocolo gerado: ${novoAtendimento.protocolo}\n` +
                        'Agora, por favor, envie sua localização.'
                    );
                    userState.step = 'AGUARDANDO_LOCALIZACAO';
                } catch (error) {
                    console.error('Erro ao criar atendimento:', error);
                    await msg.reply('Ocorreu um erro ao registrar seu atendimento. Por favor, tente novamente.');
                    userState.step = 'INICIO';
                }
                break;

            case 'LOCALIZACAO':
                if (msg.type === 'location') {
                    const { latitude, longitude } = msg.location;

                    // Atualiza a localização no banco de dados
                    await AtendimentoService.atualizarLocalizacao(currentProtocolo, latitude, longitude);

                    await delay(1000);
                    await msg.reply(
                        `Localização recebida e registrada com sucesso!\n` +
                        `Latitude: ${latitude}\nLongitude: ${longitude}`
                    );
                    userState.step = 'FINALIZADO';
                } else {
                    await msg.reply('Por favor, envie sua localização.');
                }
                break;

            case 'AGUARDANDO_LOCALIZACAO':
                if (msg.type === 'location') {
                    const { latitude, longitude } = msg.location;

                    // Atualiza a localização no banco de dados
                    await AtendimentoService.atualizarLocalizacao(currentProtocolo, latitude, longitude);

                    await delay(1000);
                    await msg.reply(
                        `Localização recebida e registrada com sucesso!\n` +
                        `Latitude: ${latitude}\nLongitude: ${longitude}`
                    );
                    userState.step = 'FINALIZADO';
                } else {
                    await msg.reply('Por favor, envie sua localização.');
                }
                break;

            case 'FINALIZADO':
                await msg.reply('Atendimento finalizado. Se precisar, entre em contato novamente.');
                userStates.delete(msg.from);
                return;

            default:
                await msg.reply('Opção inválida. ' + MENU_INICIAL);
                break;
        }

        userStates.set(msg.from, userState);
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        await msg.reply('Ocorreu um erro ao processar a mensagem. Por favor, tente novamente.');
    }
});