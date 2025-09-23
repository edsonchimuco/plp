// Ficheiro: /components/video/video.js

/**
 * Função principal que inicializa toda a lógica para a experiência
 * de visualização de vídeos em modo de foco.
 * Será chamada pelo main.js.
 */
export function initVideoFocus() {
    // --- 1. SELEÇÃO DOS ELEMENTOS DO DOM ---
    const videoFocusOverlay = document.getElementById('video-focus-overlay');
    const videoCards = document.querySelectorAll('.video-card');

    // Se não houver vídeos ou o overlay não existir, o script não continua.
    if (!videoFocusOverlay || videoCards.length === 0) {
        return;
    }

    /**
     * Função para fechar o modo de foco do vídeo.
     * Limpa o conteúdo e reativa o scroll da página.
     */
    const closeVideoFocus = () => {
        // Esconde o overlay com uma transição suave.
        videoFocusOverlay.classList.remove('active');
        // Reativa a rolagem no corpo da página.
        document.body.style.overflow = '';
        // Remove o iframe para parar a reprodução do vídeo.
        // Usamos um pequeno delay para que o vídeo não desapareça antes da transição terminar.
        setTimeout(() => {
            videoFocusOverlay.innerHTML = '';
        }, 400); // O tempo deve ser igual à duração da transição no CSS.
    };

    // --- 2. ADICIONA EVENTOS AOS CARTÕES DE VÍDEO ---
    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            // Obtém o ID do vídeo do YouTube a partir do atributo 'data-video-id' no HTML.
            const videoId = card.dataset.videoId;
            if (!videoId) {
                console.warn("Cartão de vídeo não possui um 'data-video-id'.");
                return;
            }

            // Limpa qualquer conteúdo anterior do overlay.
            videoFocusOverlay.innerHTML = '';

            // Cria o elemento iframe dinamicamente.
            const iframe = document.createElement('iframe');
            
            // Constrói o URL do YouTube com parâmetros para autoplay e melhor experiência.
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`;
            
            // Adiciona classes do Tailwind para estilização e responsividade.
            iframe.className = "w-full max-w-4xl aspect-video rounded-lg shadow-2xl";
            
            // Define os atributos necessários para a correta reprodução.
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');

            // Adiciona o iframe ao overlay.
            videoFocusOverlay.appendChild(iframe);
            
            // Mostra o overlay.
            videoFocusOverlay.classList.add('active');
            
            // Desativa a rolagem no corpo da página enquanto o vídeo está aberto.
            document.body.style.overflow = 'hidden';
        });
    });

    // --- 3. ADICIONA EVENTOS PARA FECHAR O VÍDEO ---
    
    // Fecha o vídeo se o utilizador clicar no fundo escuro (o próprio overlay).
    videoFocusOverlay.addEventListener('click', () => {
        closeVideoFocus();
    });

    // Fecha o vídeo se o utilizador pressionar a tecla "Escape".
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoFocusOverlay.classList.contains('active')) {
            closeVideoFocus();
        }
    });
}