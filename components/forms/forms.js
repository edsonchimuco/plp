// Ficheiro: /components/forms/forms.js (Versão Definitiva com JSONP)

// Variáveis globais para guardar o estado do formulário durante a chamada JSONP
let _formElement;
let _submitButton;
let _originalButtonText;
let _successMessage;
let _showToast;

/**
 * ESTA FUNÇÃO SERÁ CHAMADA PELO SCRIPT DO GOOGLE.
 * Ela precisa ser global, por isso a definimos no objeto 'window'.
 * @param {object} response - O objeto JSON retornado pelo Google Apps Script.
 */
window.jsonpCallback = function(response) {
    if (response.status === 'success') {
        _showToast(_successMessage);
        _formElement.reset();
    } else if (response.status === 'duplicate') {
        _showToast('Este email já se encontra na nossa lista de espera.');
    } else {
        console.error('Erro retornado pelo script:', response.message);
        _showToast('Ocorreu um erro. Por favor, tente novamente.');
    }

    // Reativa o botão em qualquer um dos casos
    _submitButton.disabled = false;
    _submitButton.textContent = _originalButtonText;

    // Limpa a tag de script da página
    const scriptTag = document.getElementById('jsonp-script');
    if (scriptTag) {
        scriptTag.remove();
    }
}

/**
 * Lida com o envio de dados de um formulário usando a técnica JSONP.
 */
function handleFormSubmitJSONP(form, url, successMsg, toastFunc) {
    _formElement = form;
    _submitButton = form.querySelector('button[type="submit"]');
    if (!_submitButton) return;

    // Guarda o estado para ser usado na função de callback
    _originalButtonText = _submitButton.textContent;
    _successMessage = successMsg;
    _showToast = toastFunc;

    _submitButton.disabled = true;
    _submitButton.textContent = 'A enviar...';

    // Constrói a URL com os parâmetros do formulário
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const pair of formData) {
        params.append(pair[0], pair[1]);
    }
    // Adiciona a ação e o nome da função de callback
    params.append('action', 'submit_aluno'); // ou outra ação se necessário
    params.append('callback', 'jsonpCallback');

    const scriptUrl = `${url}?${params.toString()}`;

    // Cria e injeta a tag de script para fazer a requisição
    const scriptTag = document.createElement('script');
    scriptTag.id = 'jsonp-script';
    scriptTag.src = scriptUrl;
    
    // Tratamento de erro básico se o script não carregar
    scriptTag.onerror = function() {
        console.error('Erro de rede ou script bloqueado.');
        _showToast('Falha na comunicação com o servidor.');
        _submitButton.disabled = false;
        _submitButton.textContent = _originalButtonText;
        if (scriptTag) scriptTag.remove();
    };
    
    document.head.appendChild(scriptTag);
}

/**
 * Inicializa todos os formulários da página.
 */
export function initForms(scriptUrl, leadUrl, showToast) {
    const notify = showToast || ((msg) => console.log(msg));

    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmitJSONP(
                waitlistForm, 
                scriptUrl, 
                'Inscrição recebida! Verifique o seu email para a confirmação.',
                notify
            );
        });
    }

    // Nota: A lógica para o leadForm precisaria ser adaptada de forma semelhante se também usar JSONP.
    // Por agora, esta solução foca-se no waitlistForm.
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // A implementação JSONP para o leadForm não foi feita neste exemplo,
            // mas seguiria o mesmo padrão.
            alert('Formulário de lead ainda não configurado para JSONP.');
        });
    }
}

