// Ficheiro: /main.js (Versão Definitiva e Limpa)

// --- 1. IMPORTAÇÃO DOS MÓDULOS ---
import { initPreloader } from './components/preloader/preloader.js';
import { initHeader, setHeaderTop } from './components/header/header.js';
import { initCountdown } from './components/countdown/countdown.js';
import { initCarousel } from './components/carousel/carousel.js';
import { initVideoFocus } from './components/video/video.js';
import { initModals } from './components/modal/modal.js';
import { initForms } from './components/forms/forms.js';
import { initFaq } from './components/faq/faq.js';

// --- 2. EVENT LISTENER PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
    
   // --- 3. CONFIGURAÇÕES GLOBAIS ---
    const CONTENT_URL = "https://script.google.com/macros/s/AKfycbzIH2rrJbeqgDbgd_SYznbqzKShrPbs7MpM48kgnjz83_g5X_C-Qfc-8hjss0NTbTIb8g/exec";
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzIH2rrJbeqgDbgd_SYznbqzKShrPbs7MpM48kgnjz83_g5X_C-Qfc-8hjss0NTbTIb8g/exec";
    const LEAD_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzIH2rrJbeqgDbgd_SYznbqzKShrPbs7MpM48kgnjz83_g5X_C-Qfc-8hjss0NTbTIb8g/exec";
    
    // --- 4. FUNÇÕES UTILITÁRIAS ---

    /**
     * Mostra uma notificação "toast" na base da página.
     * Esta função é passada para outros módulos que precisam de notificar o utilizador.
     */
    function showToast(msg) {
        const t = document.createElement('div');
        t.className = 'fixed left-1/2 -translate-x-1/2 bottom-8 bg-gray-800 text-white px-5 py-3 rounded-lg shadow-lg z-[110] transition-opacity duration-300 opacity-0';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.classList.remove('opacity-0'), 10);
        setTimeout(() => {
            t.classList.add('opacity-0');
            t.addEventListener('transitionend', () => t.remove());
        }, 4000);
    }
    
    /**
     * Mostra uma mensagem temporária na barra do topo para as sugestões inteligentes.
     */
    function showTopMessage(message, duration = 6000) {
        const topBar = document.getElementById('topMessageBar');
        const topBarText = document.getElementById('topMessageText');
        const mainHeader = document.querySelector('header');

        if (!mainHeader || mainHeader.classList.contains('top-0')) return;

        const originalText = topBarText.innerHTML;
        topBarText.innerHTML = message;
        topBar.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            topBarText.innerHTML = originalText;
        }, duration);
    }

    // --- 5. INICIALIZAÇÃO DE BIBLIOTECAS E GLOBAIS ---
    feather.replace();

    /**
     * Lógica para Rastreamento de Downloads do Manual
     */
    const manualDownloadButton = document.getElementById('manual-download-hero-btn');

    if (manualDownloadButton) {
        manualDownloadButton.addEventListener('click', () => {
            console.log("Botão de download do manual clicado. A registar...");

            // Tenta enviar o evento de download para a planilha em segundo plano.
            // O download para o utilizador acontece normalmente através do link no HTML.
            try {
                fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'track_download' }),
                    redirect: 'follow'
                });
            } catch (error) {
                console.error("Não foi possível registar o evento de download:", error);
            }
        });
    }
    // FIM DO NOVO BLOCO DE CÓDIGO
    
    try {
        VANTA.NET({ 
            el: "#vanta-bg", 
            mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200.00, minWidth: 200.00,
            scale: 1.00, scaleMobile: 1.00,
            color: 0x00ff88, backgroundColor: 0x070707, 
            points: 12, maxDistance: 20 
        });
    } catch (e) { 
        console.warn('Vanta.js falhou ao iniciar:', e); 
    }

    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- 6. ORQUESTRAÇÃO DOS MÓDULOS ---
    initPreloader();
    initHeader();
    initCarousel();
    initVideoFocus();
    // Passamos a função 'showToast' para os módulos que precisam dela.
    initModals(showToast);
    initForms(SCRIPT_URL, LEAD_SCRIPT_URL, showToast);
    
    /**
     * Carrega o conteúdo dinâmico da planilha e inicializa os
     * componentes que dependem desses dados (contador e FAQ).
     */
    async function loadAndInit() {
        try {
            const response = await fetch(CONTENT_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            const siteContent = data.siteContent;
            const faqData = data.faqData;
            
            const dynamicElements = {
                'event-date': siteContent['event-date'],
                'hero-subtitle': siteContent['hero-subtitle'],
                'author-bio': siteContent['author-bio'],
                'testimonial-1-text': siteContent['testimonial-1-text'],
                'testimonial-1-author': siteContent['testimonial-1-author'],
                'testimonial-2-text': siteContent['testimonial-2-text'],
                'testimonial-2-author': siteContent['testimonial-2-author'],
            };

            for (const id in dynamicElements) {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = dynamicElements[id] || 'Carregando...';
                }
            }
            
            initCountdown(siteContent['event-date']);
            initFaq(faqData);
            
        } catch (error) {
            console.error("Erro ao carregar conteúdo dinâmico:", error);
            const topBar = document.getElementById('topMessageBar');
        if (topBar) topBar.style.display = 'none';
            setHeaderTop(false);
        }
    }
    
    // Inicia o processo de carregamento de dados.
    loadAndInit();

    // --- 7. MONITORIZAÇÃO DE COMPORTAMENTO DO UTILIZADOR (SUGESTÕES) ---
    let hasClickedDownload = false;
    const downloadButton = document.getElementById('manual-download-hero-btn');

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            hasClickedDownload = true;
        });
    }

    setTimeout(() => {
        if (!hasClickedDownload) {
            showTopMessage('Dica: Não se esqueça de baixar o nosso manual gratuito!');
        }
    }, 10000);

    setTimeout(() => {
        const videoSection = document.getElementById('videos');
        if (videoSection) {
            const rect = videoSection.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
                showTopMessage('Role para baixo e veja em detalhe como o curso funciona!');
            }
        }
    }, 25000);
});



// // Ficheiro: /main.js

// // --- 1. IMPORTAÇÃO DOS MÓDULOS ---
// import { initHeader, setHeaderTop } from './components/header/header.js';
// import { initCountdown } from './components/countdown/countdown.js';
// import { initCarousel } from './components/carousel/carousel.js';
// import { initVideoFocus } from './components/video/video.js';
// import { initModals } from './components/modal/modal.js';
// import { initForms } from './components/forms/forms.js';
// import { initFaq } from './components/faq/faq.js';

// // --- 2. EVENT LISTENER PRINCIPAL ---
// document.addEventListener('DOMContentLoaded', () => {
    
//     // --- 3. CONFIGURAÇÕES GLOBAIS ---
//     const CONTENT_URL = "https://script.google.com/macros/s/AKfycbzIH2rrJbeqgDbgd_SYznbqzKShrPbs7MpM48kgnjz83_g5X_C-Qfc-8hjss0NTbTIb8g/exec";
//     const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzIH2rrJbeqgDbgd_SYznbqzKShrPbs7MpM48kgnjz83_g5X_C-Qfc-8hjss0NTbTIb8g/exec";
//     const LEAD_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzIH2rrJbeqgDbgd_SYznbqzKShrPbs7MpM48kgnjz83_g5X_C-Qfc-8hjss0NTbTIb8g/exec";

//     /**
//      * Mostra uma notificação "toast" na base da página.
//      * Esta função agora vive aqui e será passada para outros módulos.
//      */
//     function showToast(msg) {
//         const t = document.createElement('div');
//         t.className = 'fixed left-1/2 -translate-x-1/2 bottom-8 bg-gray-800 text-white px-5 py-3 rounded-lg shadow-lg z-[110] transition-opacity duration-300 opacity-0';
//         t.textContent = msg;
//         document.body.appendChild(t);
//         setTimeout(() => t.classList.remove('opacity-0'), 10);
//         setTimeout(() => {
//             t.classList.add('opacity-0');
//             t.addEventListener('transitionend', () => t.remove());
//         }, 4000);
//     }

    
//     // --- 4. INICIALIZAÇÃO DE BIBLIOTECAS E GLOBAIS ---
//     feather.replace();
    
//     try {
//         VANTA.NET({ 
//             el: "#vanta-bg", 
//             mouseControls: true, touchControls: true, gyroControls: false,
//             minHeight: 200.00, minWidth: 200.00,
//             scale: 1.00, scaleMobile: 1.00,
//             color: 0x00ff88, backgroundColor: 0x070707, 
//             points: 12, maxDistance: 20 
//         });
//     } catch (e) { 
//         console.warn('Vanta.js falhou ao iniciar:', e); 
//     }

//     const revealElements = document.querySelectorAll('.reveal');
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('is-visible');
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, { threshold: 0.1 });
//     revealElements.forEach(el => observer.observe(el));


//     // --- 5. ORQUESTRAÇÃO DOS MÓDULOS ---
//     // Inicializa os componentes que não dependem de dados externos
//     initHeader();
//     initCarousel();
//     initVideoFocus();
//     initModals();
//     initForms(SCRIPT_URL, LEAD_SCRIPT_URL);
    
    
//     /**
//      * Carrega o conteúdo dinâmico da planilha e inicializa os
//      * componentes que dependem desses dados (contador e FAQ).
//      */
//     async function loadAndInit() {
//         try {
//             const response = await fetch(CONTENT_URL);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
//             // O objeto 'data' agora contém 'siteContent' e 'faqData'
//             const data = await response.json(); 
            
//             // Separa os dados para facilitar a leitura
//             const siteContent = data.siteContent;
//             const faqData = data.faqData;
            
//             // Preenche os textos dinâmicos do site (Hero, Autor, etc.)
//             const dynamicElements = {
//                 'hero-subtitle': siteContent['hero-subtitle'],
//                 'author-bio': siteContent['author-bio'],
//                 // NOTA: As perguntas do FAQ são removidas daqui, pois o faq.js irá criá-las
//                 'testimonial-1-text': siteContent['testimonial-1-text'],
//                 'testimonial-1-author': siteContent['testimonial-1-author'],
//                 'testimonial-2-text': siteContent['testimonial-2-text'],
//                 'testimonial-2-author': siteContent['testimonial-2-author'],
//             };

//             for (const id in dynamicElements) {
//                 const element = document.getElementById(id);
//                 if (element) {
//                     element.textContent = dynamicElements[id] || 'Carregando...';
//                 }
//             }
            
//             // Inicia o contador com a data do siteContent
//             initCountdown(siteContent['event-date']);
            
//             // Inicia o FAQ, passando a base de dados de perguntas
//             initFaq(faqData);
            
//         } catch (error) {
//             console.error("Erro ao carregar conteúdo dinâmico:", error);
//             const topBar = document.getElementById('topMessageBar');
//             if (topBar) topBar.style.display = 'none';
//             setHeaderTop(false);
//         }
//     }
    
//     // Inicia todo o processo.
//     loadAndInit();
// });
