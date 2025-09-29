// Ficheiro: app.js (O coração do front-end do dashboard)

// --- CONFIGURAÇÃO ---
// !!! IMPORTANTE: Cole aqui o URL do seu NOVO App da Web que você copiou !!!
const API_URL = "https://script.google.com/macros/s/AKfycbzF_p4j50y0rcl2wnCaCM_vJBAxEiOikS6jaOvf5BkPEcDHjN0hWrHqzxvC3GgTL7HAjg/exec"; 

// --- ELEMENTOS DO DOM ---
const appContainer = document.getElementById('app');

// --- ESTADO DA APLICAÇÃO ---
let sessionToken = sessionStorage.getItem('dashboard_token');

/**
 * Função principal que inicia a aplicação.
 * Decide se mostra a tela de login ou o dashboard principal.
 */
function init() {
    if (sessionToken) {
        renderDashboard();
    } else {
        renderLogin();
    }
}

/**
 * Renderiza o HTML da tela de login.
 */
function renderLogin() {
    appContainer.innerHTML = `
        <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <div class="text-center">
                    <img src="../assets/images/logo.svg" alt="Logo" class="w-16 h-16 mx-auto mb-4">
                    <h1 class="text-2xl font-bold text-electric-green">Dashboard Login</h1>
                    <p class="text-gray-400">Programa de Alto Impacto</p>
                </div>
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input type="password" id="password" required
                            class="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-green"
                            placeholder="Digite a sua senha">
                    </div>
                    <button type="submit"
                        class="w-full px-4 py-3 font-semibold text-black bg-electric-green rounded-md hover:opacity-90 transition-opacity">
                        Entrar
                    </button>
                    <div id="errorMessage" class="text-red-400 text-center text-sm pt-2"></div>
                </form>
            </div>
        </div>
    `;

    // Adiciona o event listener ao formulário de login
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
}


/**
 * Lida com o envio do formulário de login.
 */
async function handleLoginSubmit(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const errorMessageDiv = document.getElementById('errorMessage');
    const submitButton = event.target.querySelector('button');

    errorMessageDiv.textContent = '';
    submitButton.textContent = 'A verificar...';
    submitButton.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', password: password })
        });
        const result = await response.json();

        if (result.status === 'success' && result.token) {
            sessionStorage.setItem('dashboard_token', result.token);
            sessionToken = result.token;
            renderDashboard();
        } else {
            throw new Error(result.message || 'Falha no login.');
        }

    } catch (error) {
        errorMessageDiv.textContent = error.message;
        submitButton.textContent = 'Entrar';
        submitButton.disabled = false;
    }
}


/**
 * Renderiza a estrutura principal do dashboard (a ser construída).
 * Por agora, apenas mostra uma mensagem de boas-vindas e um botão de logout.
 */
function renderDashboard() {
    appContainer.innerHTML = `
        <div class="p-8">
            <h1 class="text-3xl font-bold text-electric-green">Bem-vindo ao Dashboard!</h1>
            <p class="mt-2 text-gray-300">Aqui você poderá visualizar os dados dos inscritos.</p>
            <p class="mt-4">Carregando dados...</p>
            <button id="logoutButton" class="mt-8 px-4 py-2 bg-red-600 rounded-md hover:bg-red-700">Sair</button>
        </div>
    `;

    document.getElementById('logoutButton').addEventListener('click', () => {
        sessionStorage.removeItem('dashboard_token');
        sessionToken = null;
        renderLogin();
    });
    
    // Futuramente, chamaremos a função para buscar e mostrar os dados aqui.
    // fetchData(); 
}

// Inicia a aplicação quando o script é carregado
init();
