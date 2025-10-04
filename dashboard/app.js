// Ficheiro: app.js

const API_URL = "https://script.google.com/macros/s/AKfycbzF_p4j50y0rcl2wnCaCM_vJBAxEiOikS6jaOvf5BkPEcDHjN0hWrHqzxvC3GgTL7HAjg/exec";

const appContainer = document.getElementById('app');
let sessionToken = sessionStorage.getItem('dashboard_token');
let allSubscribers = [];

window.loginCallback = (response) => handleCallback(response, 'login');
window.dataCallback = (response) => handleCallback(response, 'data');
window.emailCallback = (response) => handleCallback(response, 'email');

function handleCallback(response, type) {
    const scriptTag = document.getElementById('api-script');
    if (scriptTag) scriptTag.remove();

    if (type === 'login') {
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
        if (response.status === 'success') {
            allSubscribers = response.subscribers.reverse();
            renderOverview(response.summary);
        } else {
            alert(response.message);
            handleLogout();
        }
    }
    
    if (type === 'email') {
        const sendButton = document.querySelector('#comunicateForm button');
        const statusDiv = document.getElementById('emailStatus');
        const quill = new Quill('#editor'); // Re-get instance if needed
        
        if (response.status === 'success') {
            statusDiv.innerHTML = `<span class="text-green-400">✅ E-mails enviados com sucesso para ${response.sentCount} destinatários!</span>`;
            document.getElementById('subject').value = '';
            quill.root.innerHTML = '';
        } else {
            statusDiv.innerHTML = `<span class="text-red-400">❌ ${response.message}</span>`;
        }
        
        sendButton.textContent = 'Enviar Mensagem';
        sendButton.disabled = false;
    }
}

function apiCall(params, callbackName) {
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

function renderLogin() {
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
    appContainer.innerHTML = `
        <div class="flex h-screen bg-gray-900 text-gray-200">
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
            <main id="main-content" class="flex-1 p-8 overflow-y-auto"></main>
        </div>
    `;
    
    feather.replace();

    document.getElementById('logoutButton').addEventListener('click', handleLogout);
    
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
    
    fetchData();
}

function renderComunicatePage() {
    const content = document.getElementById('main-content');
    if (!content) return;

    content.innerHTML = `
        <h1 class="text-3xl font-bold text-white mb-8">Comunicar em Massa</h1>
        <div class="bg-gray-800 p-6 rounded-xl max-w-4xl">
            <form id="comunicateForm">
                <div class="mb-6">
                    <label for="recipients" class="block mb-2 text-sm font-medium text-gray-300">Destinatários</label>
                    <select id="recipients" class="w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-transparent focus:outline-none focus:border-electric-green">
                        <option value="all">Todos os Inscritos (${allSubscribers.length})</option>
                        <option value="beginners">Apenas Iniciantes</option>
                    </select>
                </div>
                <div class="mb-6">
                    <label for="subject" class="block mb-2 text-sm font-medium text-gray-300">Assunto do E-mail</label>
                    <input type="text" id="subject" required class="w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-transparent focus:outline-none focus:border-electric-green" placeholder="Ex: Novidades sobre o Programa">
                </div>
                <div class="mb-6">
                    <label class="block mb-2 text-sm font-medium text-gray-300">Mensagem</label>
                    <div id="editor-container" class="bg-white text-gray-900 rounded-lg">
                        <div id="editor" style="min-height: 250px;"></div>
                    </div>
                </div>
                <div class="flex justify-end items-center gap-4">
                    <div id="emailStatus" class="text-sm h-6"></div>
                    <button type="submit" class="px-6 py-3 font-semibold text-black bg-electric-green rounded-lg hover:opacity-90 transition-opacity">
                        Enviar Mensagem
                    </button>
                </div>
            </form>
        </div>
    `;

    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'link'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
            ]
        }
    });

    document.getElementById('comunicateForm').addEventListener('submit', (event) => {
        handleComunicateSubmit(event, quill);
    });
}

function handleComunicateSubmit(event, quillInstance) {
    event.preventDefault();
    const recipientGroup = document.getElementById('recipients').value;
    const subject = document.getElementById('subject').value;
    const messageHtml = quillInstance.root.innerHTML;
    
    const sendButton = event.target.querySelector('button');
    const statusDiv = document.getElementById('emailStatus');

    if (quillInstance.getLength() <= 1) {
        statusDiv.innerHTML = '<span class="text-yellow-400">⚠️ A mensagem não pode estar vazia.</span>';
        return;
    }

    let recipientEmails = [];
    if (recipientGroup === 'all') {
        recipientEmails = allSubscribers.map(sub => sub.email);
    } else {
        const levelMap = { 'beginners': 'Iniciante (nunca programei)' };
        recipientEmails = allSubscribers.filter(sub => sub.level === levelMap[recipientGroup]).map(sub => sub.email);
    }

    if (recipientEmails.length === 0) {
        statusDiv.innerHTML = '<span class="text-yellow-400">⚠️ Nenhum destinatário para este grupo.</span>';
        return;
    }

    statusDiv.innerHTML = 'A enviar...';
    sendButton.textContent = 'A Enviar...';
    sendButton.disabled = true;

    const emailsString = recipientEmails.join(',');

    const params = new URLSearchParams({
        action: 'sendAdvancedEmail',
        token: sessionToken,
        recipients: emailsString,
        subject: subject,
        message: encodeURIComponent(messageHtml) 
    });

    apiCall(params, 'emailCallback');
}

function renderOverview(summary) {
    const content = document.getElementById('main-content');
    if (!content) return;
    content.innerHTML = `
        <h1 class="text-3xl font-bold text-white mb-8">Visão Geral</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-800 p-6 rounded-xl flex items-center gap-5">
                <div class="bg-gray-700 p-3 rounded-lg"><i data-feather="users" class="text-electric-green"></i></div>
                <div>
                    <div class="text-3xl font-bold">${summary.totalSubscribers}</div>
                    <div class="text-gray-400 text-sm">Total de Inscritos</div>
                </div>
            </div>
        </div>
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
                            <th class="py-3 px-4">Nome</th><th class="py-3 px-4">Email</th><th class="py-3 px-4">Nível</th>
                            <th class="py-3 px-4">Data de Inscrição</th><th class="py-3 px-4 text-center">Ações</th>
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

function handleLoginSubmit(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const submitButton = event.target.querySelector('button');
    document.getElementById('errorMessage').textContent = '';
    submitButton.textContent = 'A verificar...';
    submitButton.disabled = true;
    const params = new URLSearchParams({ action: 'login', password: password });
    apiCall(params, 'loginCallback');
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredSubscribers = allSubscribers.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm) ||
        sub.email.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredSubscribers);
}

function handleLogout() {
    sessionStorage.removeItem('dashboard_token');
    sessionToken = null;
    allSubscribers = [];
    renderLogin();
}

function fetchData() {
    const params = new URLSearchParams({ action: 'getData', token: sessionToken });
    apiCall(params, 'dataCallback');
}

function setActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-gray-700', 'text-white');
    });
    activeLink.classList.add('bg-gray-700', 'text-white');
}

function init() {
    if (sessionToken) {
        renderDashboardLayout();
    } else {
        renderLogin();
    }
}

init();