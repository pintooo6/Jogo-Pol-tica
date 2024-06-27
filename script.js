// Definição de variáveis e estado do jogo
let player = {
    name: "Político Pinto",
    popularity: 50,
    policiesImplemented: 0,
    funds: 10000,
    incomePerTurn: 2000 // Nova variável para renda por turno
};

let politicians = []; // Array para armazenar políticos NPCs (incluindo inimigos)

let eventLog = document.getElementById('eventLog');
let politiciansUI = document.getElementById('politicians');
let incomeUI = document.getElementById('incomePerTurn'); // Elemento na interface para mostrar a renda por turno

// Função para inicializar o jogo
function initGame() {
    createNPCPoliticians(); // Criar políticos NPCs iniciais (incluindo inimigos)
    updateStatusUI();
    updatePoliticiansUI();
    updateIncomeUI(); // Atualizar a interface com a renda por turno inicial
}

// Função para criar políticos NPCs iniciais (incluindo inimigos)
function createNPCPoliticians() {
    // Exemplo de criação de 3 políticos NPCs
    for (let i = 0; i < 2; i++) {
        let politician = {
            name: `Político NPC ${i + 1}`,
            popularity: Math.floor(Math.random() * 50) + 20, // Popularidade inicial entre 20 e 70
            policiesImplemented: Math.floor(Math.random() * 5), // Políticas implementadas inicialmente
            funds: Math.floor(Math.random() * 5000) + 5000, // Fundos iniciais entre 5000 e 10000
            isEnemy: false // Marcador para distinguir políticos inimigos
        };
        politicians.push(politician);
    }

    // Criar políticos inimigos
    for (let i = 0; i < 1; i++) {
        let enemyPolitician = {
            name: `Político Inimigo ${i + 1}`,
            popularity: Math.floor(Math.random() * 40) + 30, // Popularidade inicial entre 30 e 70
            policiesImplemented: Math.floor(Math.random() * 3), // Políticas implementadas inicialmente
            funds: Math.floor(Math.random() * 3000) + 7000, // Fundos iniciais entre 7000 e 10000
            isEnemy: true // Marcador para distinguir políticos inimigos
        };
        politicians.push(enemyPolitician);
    }
}

// Função para atualizar a interface de status do jogador
function updateStatusUI() {
    document.getElementById('playerName').textContent = player.name;
    document.getElementById('playerPopularity').textContent = player.popularity;
    document.getElementById('policiesImplemented').textContent = player.policiesImplemented;
    document.getElementById('playerFunds').textContent = player.funds.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // Formatação de moeda
}

// Função para atualizar a interface de status dos políticos NPCs
function updatePoliticiansUI() {
    politiciansUI.innerHTML = ''; // Limpar conteúdo atual

    politicians.forEach((politician, index) => {
        let politicianElement = document.createElement('div');
        politicianElement.classList.add('politician');
        if (politician.isEnemy) {
            politicianElement.classList.add('enemy');
        }
        politicianElement.innerHTML = `
            <h3>${politician.name}</h3>
            <p><strong>Popularidade:</strong> ${politician.popularity}</p>
            <p><strong>Políticas Implementadas:</strong> ${politician.policiesImplemented}</p>
            <p><strong>Fundos Disponíveis:</strong> ${politician.funds.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        `;
        politiciansUI.appendChild(politicianElement);
    });
}

// Função para atualizar a interface com a renda por turno
function updateIncomeUI() {
    incomeUI.textContent = player.incomePerTurn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // Formatação de moeda
}

// Função para implementar uma nova política pelo jogador
function implementPolicy() {
    player.popularity += 5;
    player.funds -= 1000;
    player.policiesImplemented++;

    updateStatusUI();
    logEvent(`Implementou uma nova política. Popularidade +5, Fundos -R$1.000,00.`);
}

// Função para iniciar uma campanha eleitoral pelo jogador
function runCampaign() {
    let campaignCost = 2000;
    player.funds -= campaignCost;
    let impact = Math.floor(Math.random() * 10) + 1;
    player.popularity += impact;

    updateStatusUI();
    logEvent(`Iniciou uma campanha eleitoral. Popularidade +${impact}, Fundos -R$2.000,00.`);
}

// Função para simular o próximo turno (continuação)
function nextTurn() {
    // Ação do jogador (exemplo de evento aleatório)
    let randomEvent = Math.random();
    if (randomEvent < 0.3) {
        let bonus = Math.floor(Math.random() * 5) + 1;
        player.popularity += bonus;
        logEvent(`Evento positivo para ${player.name}! Popularidade +${bonus}.`);
    } else if (randomEvent < 0.6) {
        let penalty = Math.floor(Math.random() * 5) + 1;
        player.popularity -= penalty;
        logEvent(`Evento negativo para ${player.name}! Popularidade -${penalty}.`);
    } else {
        logEvent(`Nenhum evento este turno para ${player.name}.`);
    }

    // Ação dos políticos NPCs e inimigos
    politicians.forEach((politician) => {
        if (politician.isEnemy) {
            // Ação do político inimigo
            enemyDecision(politician);
        } else {
            // Ação de políticos NPCs regulares
            regularNPCDecision(politician);
        }
    });

    player.funds += player.incomePerTurn; // Adicionar renda por turno aos fundos do jogador

    updateStatusUI();
    updatePoliticiansUI();
}

// Função para decisão do político inimigo
function enemyDecision(politician) {
    // Simples IA inimiga que sempre tenta prejudicar o jogador
    if (politician.popularity > player.popularity) {
        // Político inimigo implementa uma nova política prejudicial
        politician.popularity += Math.floor(Math.random() * 5) + 1;
        politician.funds -= 1000;
        politician.policiesImplemented++;
        logEvent(`${politician.name} implementou uma nova política prejudicial. Popularidade +${politician.popularity}, Fundos -R$1.000,00.`);
    } else {
        // Político inimigo inicia uma campanha eleitoral
        let campaignCost = Math.floor(Math.random() * 2000) + 1000;
        politician.funds -= campaignCost;
        let impact = Math.floor(Math.random() * 5) + 1;
        politician.popularity += impact;
        logEvent(`${politician.name} iniciou uma campanha eleitoral contra ${player.name}. Popularidade +${impact}, Fundos -R$${campaignCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`);
    }
}

// Função para decisão de políticos NPCs regulares (aleatória)
function regularNPCDecision(politician) {
    let decision = Math.random();
    if (decision < 0.5) {
        // Implementar uma nova política
        politician.popularity += Math.floor(Math.random() * 5) + 1;
        politician.funds -= 1000;
        politician.policiesImplemented++;
        logEvent(`${politician.name} implementou uma nova política. Popularidade +${politician.popularity}, Fundos -R$1.000,00.`);
    } else {
        // Iniciar uma campanha eleitoral
        let campaignCost = Math.floor(Math.random() * 2000) + 1000;
        politician.funds -= campaignCost;
        let impact = Math.floor(Math.random() * 5) + 1;
        politician.popularity += impact;
        logEvent(`${politician.name} iniciou uma campanha eleitoral. Popularidade +${impact}, Fundos -R$${campaignCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`);
    }
}

// Função para registrar eventos no log de eventos
function logEvent(message) {
    let eventMessage = document.createElement('p');
    eventMessage.textContent = message;
    eventLog.appendChild(eventMessage);
    eventLog.scrollTop = eventLog.scrollHeight; // Rolagem automática para o último evento
}
// Mostrar o overlay de carregamento ao iniciar
$(window).on('load', function() {
    $('#overlay').fadeOut();
});

// Mostrar o overlay de carregamento ao clicar em algum botão de controle
$('#implementPolicyBtn, #runCampaignBtn, #nextTurnBtn').on('click', function() {
    $('#overlay').fadeIn();
    setTimeout(function() {
        $('#overlay').fadeOut();
    }, 1000); // Tempo simulado de carregamento (1 segundo)
});

// Inicializa o mapa e define a visualização inicial
var map = L.map('map').setView([20, 0], 2);

// Adiciona a camada do mapa (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Dados dos políticos (latitude, longitude, nome)
var politiciansMap = [
    { lat: 38.89511, lng: -77.03637, name: "Político Pinto" },  // Exemplo: Washington, DC
    { lat: 51.509865, lng: -0.118092, name: "Político Nuno" },  // Exemplo: Londres
    { lat: 35.689487, lng: 139.691711, name: "Político Flynn" }, // Exemplo: Tóquio
    { lat: -33.865143, lng: 151.209900, name: "Político Heisenbergs" }, // Exemplo: Sydney
    // Adicione mais políticos conforme necessário
];

// Adiciona marcadores no mapa para cada político
politiciansMap.forEach(function(politician) {
    var marker = L.marker([politician.lat, politician.lng]).addTo(map);
    marker.bindPopup(`<b>${politician.name}</b>`).openPopup();
});
