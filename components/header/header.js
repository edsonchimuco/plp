// Ficheiro: /components/header/header.js

// --- 1. SELEÇÃO DOS ELEMENTOS DO DOM ---
const mainHeader = document.querySelector('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

/**
 * Função auxiliar para mostrar ou esconder o menu mobile.
 */
const toggleMenu = () => {
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
};

/**
 * Função principal que inicializa toda a lógica do header.
 * Será chamada pelo main.js.
 */
export function initHeader() {
    // Garante que o código não executa se algum elemento não for encontrado.
    if (!mainHeader || !mobileMenuBtn || !mobileMenu) {
        console.warn("Elementos do header não foram encontrados. A funcionalidade do menu pode estar inativa.");
        return;
    }

    // Adiciona o evento de clique ao botão do menu hambúrguer.
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede que o clique se propague para o document.
        toggleMenu();
    });

    // Adiciona um evento global para fechar o menu se o utilizador clicar fora dele.
    document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Adiciona um evento para fechar o menu quando um link de navegação é clicado.
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            toggleMenu();
        }
    });
}

/**
 * Função auxiliar que é exportada para ser chamada por outros módulos (como o countdown.js).
 * Ajusta a posição vertical do header.
 * @param {boolean} isSticky - Se true, o header fica a 'top-12'. Se false, fica a 'top-0'.
 */
export function setHeaderTop(isSticky) {
    if (!mainHeader) return;

    if (isSticky) {
        // Posição para quando a barra de contagem está visível.
        mainHeader.classList.remove('top-0');
        mainHeader.classList.add('top-12');
    } else {
        // Posição para quando a barra de contagem está escondida.
        mainHeader.classList.remove('top-12');
        mainHeader.classList.add('top-0');
    }
}