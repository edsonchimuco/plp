// Ficheiro: /components/faq/faq.js

// Variável para guardar os dados do FAQ para evitar múltiplas buscas
let allFaqData = [];
const container = document.getElementById('faq-container');
const searchInput = document.getElementById('faq-search');
const noResultsMessage = document.getElementById('faq-no-results');
const loadingMessage = document.getElementById('faq-loading');

/**
 * Cria o HTML para a secção de FAQ a partir dos dados recebidos.
 * @param {Array} faqItems - Um array de objetos com {category, question, answer}.
 */
function renderFaq(faqItems) {
    if (!container) return;
    
    // Agrupa as perguntas por categoria
    const groupedByCategory = faqItems.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {});

    let html = '';
    for (const category in groupedByCategory) {
        html += `
            <div class="faq-category-group">
                <h3 class="text-xl font-bold text-electric-green mt-8 mb-4">${category}</h3>
                <div class="space-y-3">
        `;
        
        groupedByCategory[category].forEach(item => {
            html += `
                <details class="faq-item glass rounded-lg overflow-hidden group">
                    <summary class="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-800/50 transition-colors">
                        <span class="font-semibold text-gray-200 group-open:text-white">${item.question}</span>
                        <i data-feather="chevron-down" class="chevron-icon transition-transform duration-300 flex-shrink-0 ml-4"></i>
                    </summary>
                    <div class="px-5 py-4 border-t border-gray-700 text-gray-300 leading-relaxed">
                        ${item.answer}
                    </div>
                </details>
            `;
        });

        html += `</div></div>`;
    }

    container.innerHTML = html;
    feather.replace(); // Re-ativa os ícones Feather após serem adicionados dinamicamente

    // Adiciona a lógica do "acordeão de resposta única"
    const allDetails = container.querySelectorAll('.faq-item');
    allDetails.forEach(details => {
        details.addEventListener('toggle', (e) => {
            if (e.target.open) {
                // Fecha todos os outros que estiverem abertos
                allDetails.forEach(otherDetails => {
                    if (otherDetails !== e.target) {
                        otherDetails.open = false;
                    }
                });
            }
        });
    });
}

/**
 * Filtra as perguntas com base no termo de pesquisa.
 */
function filterFaq() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const allItems = container.querySelectorAll('.faq-item');
    const allCategories = container.querySelectorAll('.faq-category-group');
    let totalMatches = 0;

    allCategories.forEach(category => {
        const questionsInCategory = category.querySelectorAll('.faq-item');
        let categoryHasMatch = false;
        
        questionsInCategory.forEach(item => {
            const questionText = item.querySelector('summary span').textContent.toLowerCase();
            const answerText = item.querySelector('div').textContent.toLowerCase();
            
            if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                item.style.display = 'block';
                categoryHasMatch = true;
                totalMatches++;
            } else {
                item.style.display = 'none';
            }
        });

        // Mostra ou esconde o título da categoria
        category.style.display = categoryHasMatch ? 'block' : 'none';
    });

    // Mostra ou esconde a mensagem de "nenhum resultado"
    noResultsMessage.style.display = totalMatches === 0 && searchTerm.length > 0 ? 'block' : 'none';
}

/**
 * Função principal que será chamada pelo main.js
 * @param {Array} faqData - Os dados do FAQ vindos da função de carregamento principal.
 */
export function initFaq(faqData) {
    if (!container || !searchInput || !noResultsMessage || !loadingMessage) return;

    allFaqData = faqData;
    loadingMessage.style.display = 'none'; // Esconde a mensagem de "a carregar"

    if (allFaqData && allFaqData.length > 0) {
        renderFaq(allFaqData);
        searchInput.addEventListener('input', filterFaq);
    } else {
        container.innerHTML = '<p class="text-center text-gray-500">Não foi possível carregar as perguntas.</p>';
    }
}