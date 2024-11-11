# Repositório para Projeto do Hackathon - Senai Feira de Santana

**Data do Hackathon:** 09/11/2024  
**Colocação:** 2º lugar  
**Tema:** Soluções para o SAMU

## Descrição do Projeto
O projeto desenvolvido durante o hackathon é uma aplicação para otimizar o atendimento aos usuários do SAMU por meio de um **chatbot integrado ao WhatsApp**. O chatbot oferece funcionalidades de triagem básica e consulta de protocolos de atendimento, e é acessível via celular e por um painel de controle médico.

### Funcionalidades
1. **Escaneamento via QR Code**: Ao rodar a aplicação, o usuário escaneia um QR Code com o WhatsApp Web, conectando o celular como cliente do chatbot.
2. **Triagem e Atendimento via Chatbot**: O chatbot permite:
   - **Triagem**: Inicia um processo de triagem onde o usuário envia informações sobre seu estado de saúde.
   - **Consulta de Protocolo**: Para usuários já atendidos, o chatbot oferece a consulta do protocolo de atendimento.
3. **Envio de Localização**: Em ambos os fluxos (triagem ou consulta de protocolo), o usuário envia sua localização, permitindo o acompanhamento do atendimento.
4. **Painel para Médicos**: Um front-end permite que médicos visualizem os atendimentos, status e localização dos pacientes.

## Tecnologias Utilizadas
- **Node.js e Express.js**: Utilizados para o backend, gerenciando rotas e integrações necessárias.
- **MongoDB com Mongoose**: Banco de dados utilizado com Mongoose para facilitar o mapeamento de dados.
- **whatsapp-web.js**: Biblioteca para integração com o WhatsApp Web, permitindo a troca de mensagens via chatbot.
- **qrcode-terminal**: Biblioteca usada para gerar QR Codes.
- **EJS (Embedded JavaScript)**: Utilizado no front-end para renderizar páginas dinâmicas.
- **CSS e Bootstrap**: Usados para estilização do front-end e garantir um layout responsivo e moderno.
