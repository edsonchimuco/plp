// Ficheiro: app.js (Versão com a Página "Comunicar")

// !!! IMPORTANTE: Confirme que o URL da sua API está correto aqui !!!
const API_URL = "https://script.google.com/macros/s/AKfycbzF_p4j50y0rcl2wnCaCM_vJBAxEiOikS6jaOvf5BkPEcDHjN0hWrHqzxvC3GgTL7HAjg/exec";

const appContainer = document.getElementById('app');
let sessionToken = sessionStorage.getItem('dashboard_token');
let allSubscribers = []; // Cache para guardar os dados dos inscritos

// --- Funções de Callback Globais para JSONP ---
window.loginCallback = (response) => handleCallback(response, 'login');
window.dataCallback = (response) => handleCallback(response, 'data');
window.emailCallback = (response) => handleCallback(response, 'email'); // Novo callback

/**
 * Função genérica para tratar as respostas da API.
 */
function handleCallback(response, type) {
    const scriptTag = document.getElementById('api-script');
    if (scriptTag) scriptTag.remove();

    if (type === 'login') {
        // ... (código existente, sem alterações)
        const errorMessageDiv = document.getElementById('errorMessage');
        const submitButton = document.querySelector('#loginForm button');
        if (response.status === 'success' && response.token) {
            sessionStorage.setItem('dashboard_token', response.token);
            sessionToken = response.token;
            renderDashboardLayout();
        } else {
            errorMessageDiv.textContent = response.message || 'Falha no login.';
            if(submitButton) {
                submitButton.textContent = 'Entrar';
                submitButton.disabled = false;
            }
        }
    }

    if (type === 'data') {
        // ... (código existente, sem alterações)
        if (response.status === 'success') {
            allSubscribers = response.subscribers.reverse();
            renderOverview(response.summary); // Renderiza a página inicial
        } else {
            alert(response.message);
            handleLogout();
        }
    }
    
    // NOVO: Tratamento da resposta do envio de email
    if (type === 'email') {
        const sendButton = document.querySelector('#comunicateForm button');
        const statusDiv = document.getElementById('emailStatus');
        
        if (response.status === 'success') {
            statusDiv.innerHTML = `<span class="text-green-400">✅ E-mails enviados com sucesso para ${response.sentCount} destinatários!</span>`;
            document.getElementById('comunicateForm').reset();
        } else {
            statusDiv.innerHTML = `<span class="text-red-400">❌ ${response.message}</span>`;
        }
        
        sendButton.textContent = 'Enviar Mensagem';
        sendButton.disabled = false;
    }
}

/**
 * Função para fazer chamadas à API usando a técnica JSONP.
 */
function apiCall(params, callbackName) {
    // ... (código existente, sem alterações)
    params.append('callback', callbackName);
    const scriptUrl = `${API_URL}?${params.toString()}`;
    const scriptTag = document.createElement('script');
    scriptTag.id = 'api-script';
    scriptTag.src = scriptUrl;
    scriptTag.onerror = () => {
        alert("Erro de comunicação com a API. Verifique a consola.");
        if (scriptTag) scriptTag.remove();
    };
    document.head.appendChild(scriptTag);
}

// --- LÓGICA DE RENDERIZAÇÃO DA INTERFACE ---

function renderLogin() {
    // ... (código existente, sem alterações)
    appContainer.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gray-900">
            <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl">
                <div class="text-center">
                    <img src="../assets/images/logo.svg" alt="Logo" class="w-16 h-16 mx-auto mb-4">
                    <h1 class="text-2xl font-bold text-electric-green">Dashboard Login</h1>
                    <p class="text-gray-400">Programa de Alto Impacto</p>
                </div>
                <form id="loginForm" class="space-y-6">
                    <input type="password" id="password" required
                        class="w-full px-4 py-3 text-white bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:border-electric-green transition"
                        placeholder="Digite a sua senha">
                    <button type="submit"
                        class="w-full px-4 py-3 font-semibold text-black bg-electric-green rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105">
                        Entrar
                    </button>
                    <div id="errorMessage" class="text-red-400 text-center text-sm pt-2 h-6"></div>
                </form>
            </div>
        </div>
    `;
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
}


function renderDashboardLayout() {
    // ... (código existente, com pequenas adições de eventos)
    appContainer.innerHTML = `
        <div class="flex h-screen bg-gray-900 text-gray-200">
            <!-- Sidebar -->
            <aside class="w-64 flex-shrink-0 bg-gray-800 p-6 flex flex-col justify-between">
                <div>
                    <div class="flex items-center gap-3 mb-10">
                        <img src="../assets/images/logo.svg" alt="Logo" class="w-10 h-10">
                        <span class="text-xl font-bold text-electric-green">Dashboard</span>
                    </div>
                    <nav class="space-y-3">
                        <a href="#" id="nav-overview" class="nav-link flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-700 text-white">
                            <i data-feather="home"></i> Visão Geral
                        </a>
                        <a href="#" id="nav-comunicate" class="nav-link flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                            <i data-feather="send"></i> Comunicar
                        </a>
                    </nav>
                </div>
                <button id="logoutButton" class="flex items-center gap-3 px-4 py-2 text-red-400 rounded-lg hover:bg-red-900/50 transition">
                    <i data-feather="log-out"></i> Sair
                </button>
            </aside>

            <!-- Área de Conteúdo Principal -->
            <main id="main-content" class="flex-1 p-8 overflow-y-auto">
                <!-- O conteúdo da página será inserido aqui -->
            </main>
        </div>
    `;
    
    feather.replace();

    document.getElementById('logoutButton').addEventListener('click', handleLogout);
    
    // NOVO: Adiciona eventos de clique para a navegação
    document.getElementById('nav-overview').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(e.target.closest('a'));
        renderOverview({ totalSubscribers: allSubscribers.length });
    });
    document.getElementById('nav-comunicate').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(e.target.closest('a'));
        renderComunicatePage();
    });
    
    fetchData(); // Carrega os dados para a página inicial
}

/**
 * NOVO: Renderiza a página "Comunicar".
 */
function renderComunicatePage() {
    const content = document.getElementById('main-content');
    if (!content) return;

    content.innerHTML = `
        <h1 class="text-3xl font-bold text-white mb-8">Comunicar em Massa</h1>
        <div class="bg-gray-800 p-6 rounded-xl max-w-3xl">
            <form id="comunicateForm">
                <!-- Seleção de Destinatários -->
                <div class="mb-6">
                    <label for="recipients" class="block mb-2 text-sm font-medium text-gray-300">Destinatários</label>
                    <select id="recipients" class="w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-transparent focus:outline-none focus:border-electric-green">
                        <option value="all">Todos os Inscritos (${allSubscribers.length})</option>
                        <option value="beginners">Apenas Iniciantes</option>
                        <option value="basics">Apenas Nível Básico</option>
                        <option value="intermediates">Apenas Intermediários</option>
                        <option value="advanced">Apenas Avançados</option>
                    </select>
                </div>

                <!-- Assunto do Email -->
                <div class="mb-6">
                    <label for="subject" class="block mb-2 text-sm font-medium text-gray-300">Assunto do E-mail</label>
                    <input type="text" id="subject" required class="w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-transparent focus:outline-none focus:border-electric-green" placeholder="Ex: Novidades sobre o Programa">
                </div>

                <!-- Mensagem -->
                <div class="mb-6">
                    <label for="message" class="block mb-2 text-sm font-medium text-gray-300">Mensagem</label>
                    <textarea id="message" rows="10" required class="w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-transparent focus:outline-none focus:border-electric-green" placeholder="Digite a sua mensagem aqui..."></textarea>
                </div>

                <!-- Botão de Envio -->
                <div class="flex justify-end items-center gap-4">
                    <div id="emailStatus" class="text-sm h-6"></div>
                    <button type="submit" class="px-6 py-3 font-semibold text-black bg-electric-green rounded-lg hover:opacity-90 transition-opacity">
                        Enviar Mensagem
                    </button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('comunicateForm').addEventListener('submit', handleComunicateSubmit);
}


function renderOverview(summary) {
    // ... (código existente, sem alterações)
    const content = document.getElementById('main-content');
    if (!content) return;

    content.innerHTML = `
        <h1 class="text-3xl font-bold text-white mb-8">Visão Geral</h1>
        
        <!-- Cards de Resumo -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-800 p-6 rounded-xl flex items-center gap-5">
                <div class="bg-gray-700 p-3 rounded-lg"><i data-feather="users" class="text-electric-green"></i></div>
                <div>
                    <div class="text-3xl font-bold">${summary.totalSubscribers}</div>
                    <div class="text-gray-400 text-sm">Total de Inscritos</div>
                </div>
            </div>
        </div>

        <!-- Tabela de Inscritos -->
        <div class="bg-gray-800 p-6 rounded-xl">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Inscritos Recentes</h2>
                <input type="text" id="searchInput" placeholder="Pesquisar por nome ou email..." 
                       class="w-72 px-4 py-2 bg-gray-700 rounded-lg border-2 border-transparent focus:outline-none focus:border-electric-green">
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-gray-700 text-sm text-gray-400">
                            <th class="py-3 px-4">Nome</th>
                            <th class="py-3 px-4">Email</th>
                            <th class="py-3 px-4">Nível</th>
                            <th class="py-3 px-4">Data de Inscrição</th>
                            <th class="py-3 px-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="subscribers-table-body"></tbody>
                </table>
            </div>
        </div>
    `;
    
    renderTable(allSubscribers);

    document.getElementById('searchInput').addEventListener('input', handleSearch);

    feather.replace();
}

function renderTable(subscribers) {
    // ... (código existente, sem alterações)
    const tableBody = document.getElementById('subscribers-table-body');
    if (!tableBody) return;

    if (subscribers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Nenhum inscrito encontrado.</td></tr>';
        return;
    }

    tableBody.innerHTML = subscribers.map(sub => `
        <tr class="border-b border-gray-700 hover:bg-gray-700/50">
            <td class="py-3 px-4 font-medium">${sub.name}</td>
            <td class="py-3 px-4 text-gray-400">${sub.email}</td>
            <td class="py-3 px-4"><span class="bg-gray-700 px-2 py-1 text-xs rounded-full">${sub.level || 'Não definido'}</span></td>
            <td class="py-3 px-4 text-gray-400">${new Date(sub.timestamp).toLocaleDateString('pt-PT')}</td>
            <td class="py-3 px-4 text-center">
                <button title="Enviar Email" class="p-2 hover:text-electric-green transition"><i data-feather="mail" class="w-4 h-4"></i></button>
                <button title="Conversar no WhatsApp" class="p-2 hover:text-electric-green transition"><i data-feather="message-circle" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');
    
    feather.replace();
}


// --- LÓGICA DE MANIPULAÇÃO DE DADOS E EVENTOS ---
function handleLoginSubmit(event) {
    // ... (código existente, sem alterações)
    event.preventDefault();
    const password = document.getElementById('password').value;
    const submitButton = event.target.querySelector('button');
    document.getElementById('errorMessage').textContent = '';
    submitButton.textContent = 'A verificar...';
    submitButton.disabled = true;
    const params = new URLSearchParams({ action: 'login', password: password });
    apiCall(params, 'loginCallback');
}

/**
 * NOVO: Lida com o envio do formulário de comunicação.
 */
function handleComunicateSubmit(event) {
    event.preventDefault();
    const recipientGroup = document.getElementById('recipients').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const sendButton = event.target.querySelector('button');
    const statusDiv = document.getElementById('emailStatus');

    // Filtra os emails com base no grupo selecionado
    let recipientEmails = [];
    if (recipientGroup === 'all') {
        recipientEmails = allSubscribers.map(sub => sub.email);
    } else {
        const levelMap = {
            'beginners': 'Iniciante (nunca programei)',
            'basics': 'Básico (sei a lógica)',
            'intermediates': 'Intermediário (já criei projetos)',
            'advanced': 'Avançado (trabalho na área)'
        };
        const targetLevel = levelMap[recipientGroup];
        recipientEmails = allSubscribers.filter(sub => sub.level === targetLevel).map(sub => sub.email);
    }

    if (recipientEmails.length === 0) {
        statusDiv.innerHTML = '<span class="text-yellow-400">⚠️ Nenhum destinatário encontrado para este grupo.</span>';
        return;
    }

    statusDiv.innerHTML = 'A enviar...';
    sendButton.textContent = 'A Enviar...';
    sendButton.disabled = true;

    // Converte a lista de emails para uma string separada por vírgulas
    const emailsString = recipientEmails.join(',');

    const params = new URLSearchParams({
        action: 'sendBulkEmail',
        token: sessionToken,
        recipients: emailsString,
        subject: subject,
        message: message
    });

    apiCall(params, 'emailCallback');
}


function handleSearch(event) {
    // ... (código existente, sem alterações)
    const searchTerm = event.target.value.toLowerCase();
    const filteredSubscribers = allSubscribers.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm) ||
        sub.email.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredSubscribers);
}

function handleLogout() {
    // ... (código existente, sem alterações)
    sessionStorage.removeItem('dashboard_token');
    sessionToken = null;
    allSubscribers = [];
    renderLogin();
}

function fetchData() {
    // ... (código existente, sem alterações)
    const params = new URLSearchParams({ action: 'getData', token: sessionToken });
    apiCall(params, 'dataCallback');
}

/**
 * NOVO: Função para destacar o item de navegação ativo.
 */
function setActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-gray-700', 'text-white');
    });
    activeLink.classList.add('bg-gray-700', 'text-white');
}


function init() {
    // ... (código existente, sem alterações)
    if (sessionToken) {
        renderDashboardLayout();
    } else {
        renderLogin();
    }
}

init();