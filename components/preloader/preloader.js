// Ficheiro: /components/preloader/preloader.js

/**
 * Inicializa a lógica do preloader.
 */
export function initPreloader() {
    const preloader = document.getElementById('preloader');

    if (!preloader) return;

    // O evento 'load' espera que TUDO na página (imagens, scripts, etc.)
    // seja carregado, ao contrário do 'DOMContentLoaded'.
    window.addEventListener('load', () => {
        // Adiciona a classe que ativa a transição de desaparecimento do CSS.
        preloader.classList.add('hidden');

        // Ouve o final da transição para remover o elemento da frente.
        preloader.addEventListener('transitionend', () => {
            // Define 'display: none' para que o preloader não intercepte cliques
            // mesmo estando invisível.
            preloader.style.display = 'none';
        }, { once: true }); // O evento só precisa de ser ouvido uma vez.
    });
}