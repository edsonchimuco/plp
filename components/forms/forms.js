// Ficheiro: /components/forms/forms.js (Versão Corrigida)

/**
 * Lida com o envio de dados de um formulário.
 * Agora recebe a função showToast como um parâmetro para poder usá-la.
 */
async function handleFormSubmit(form, url, successMessage, showToast) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'A enviar...';

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            redirect: 'follow'
        });
        
        // AGORA FUNCIONA: Chama a função showToast que foi recebida.
        showToast(successMessage);
        form.reset();

    } catch (error) {
        console.error('Erro no envio do formulário:', error);
        // AGORA FUNCIONA: Também mostra o toast em caso de erro.
        showToast('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

/**
 * Inicializa todos os formulários da página.
 * Agora aceita showToast como um terceiro argumento.
 */
export function initForms(waitlistUrl, leadUrl, showToast) {
    // Se a função showToast não for passada, cria uma função vazia para evitar erros.
    const notify = showToast || ((msg) => console.log(msg));

    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(
                waitlistForm, 
                waitlistUrl, 
                'Inscrição recebida! Entraremos em contacto em breve.',
                notify // Passa a função de notificação
            );
        });
    }

    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(
                leadForm, 
                leadUrl, 
                'Contacto recebido! Falaremos consigo em breve.',
                notify // Passa a função de notificação
            );
        });
    }
}


// // Ficheiro: /components/forms/forms.js

// // --- 1. FUNÇÃO AUXILIAR GLOBAL ---
// // Esta função é definida no escopo do módulo, mas não é exportada.
// // Ela é reutilizada por todos os formulários.

// /**
//  * Lida com o envio de dados de um formulário para um URL do Google Apps Script.
//  * @param {HTMLFormElement} form - O elemento do formulário a ser enviado.
//  * @param {string} url - O URL do script para o qual os dados serão enviados.
//  * @param {string} successMessage - A mensagem a ser exibida em caso de sucesso.
//  */
// async function handleFormSubmit(form, url, successMessage) {
//     // Seleciona o botão de submissão dentro do formulário específico.
//     const submitButton = form.querySelector('button[type="submit"]');
//     if (!submitButton) return;

//     // Guarda o texto original do botão e desativa-o para feedback visual.
//     const originalButtonText = submitButton.textContent;
//     submitButton.disabled = true;
//     submitButton.textContent = 'A enviar...';

//     try {
//         // Converte os dados do formulário para um objeto simples.
//         const formData = new FormData(form);
//         const data = Object.fromEntries(formData.entries());

//         // Faz a requisição POST para o URL do Google Apps Script.
//         // O modo 'no-cors' é frequentemente usado para evitar problemas com
//         // o redirecionamento padrão do Apps Script, garantindo que o envio funcione.
//         await fetch(url, {
//             method: 'POST',
//             mode: 'no-cors',
//             cache: 'no-cache',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//             redirect: 'follow'
//         });

//         // Se a requisição for enviada (mesmo sem ler a resposta), mostra sucesso.
//         // A função showToast() é assumida como global (definida no seu HTML ou outro script).
//         showToast(successMessage);
//         form.reset(); // Limpa o formulário

//     } catch (error) {
//         console.error('Erro no envio do formulário:', error);
//         showToast('Ocorreu um erro. Por favor, tente novamente.');
//     } finally {
//         // Bloco 'finally' garante que o botão seja reativado e o texto restaurado,
//         // quer o envio tenha sucesso ou falhe.
//         submitButton.disabled = false;
//         submitButton.textContent = originalButtonText;
//     }
// }


// // --- 2. FUNÇÃO DE INICIALIZAÇÃO PRINCIPAL ---
// // Esta é a única função exportada do módulo. Ela encontra os formulários na
// // página e adiciona os eventos de submissão a eles.

// /**
//  * Inicializa todos os formulários da página.
//  * @param {string} waitlistUrl - O URL para o formulário da lista de espera.
//  * @param {string} leadUrl - O URL para o formulário de leads.
//  */
// export function initForms(waitlistUrl, leadUrl) {
//     // Inicializa o formulário principal da lista de espera
//     const waitlistForm = document.getElementById('waitlistForm');
//     if (waitlistForm) {
//         waitlistForm.addEventListener('submit', (e) => {
//             e.preventDefault(); // Impede o recarregamento da página
//             handleFormSubmit(
//                 waitlistForm, 
//                 waitlistUrl, 
//                 'Inscrição recebida! Entraremos em contacto em breve.'
//             );
//         });
//     }

//     // Inicializa o formulário do modal de leads (intenção de saída)
//     const leadForm = document.getElementById('leadForm');
//     if (leadForm) {
//         leadForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             handleFormSubmit(
//                 leadForm, 
//                 leadUrl, 
//                 'Contacto recebido! Falaremos consigo em breve.'
//             );
//         });
//     }
// }