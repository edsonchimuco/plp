// Ficheiro: /components/modal/modal.js

// --- 1. LÓGICA PARA O MODAL IFRAME (POLÍTICAS, TERMOS) ---
function initIframeModal() {
    const iframeModal = document.getElementById('iframeModal');
    if (!iframeModal) return;

    const modalIframe = iframeModal.querySelector('iframe');
    const triggers = document.querySelectorAll('.modal-trigger');
    const closeBtn = iframeModal.querySelector('.modal-close-btn');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const url = trigger.dataset.url;
            if (url) {
                modalIframe.src = url;
                iframeModal.classList.add('active');
            }
        });
    });

    const closeModal = () => {
        iframeModal.classList.remove('active');
        modalIframe.src = ''; // Limpa o src para parar vídeos ou carregamentos
    };

    closeBtn.addEventListener('click', closeModal);
    iframeModal.addEventListener('click', (e) => {
        if (e.target === iframeModal) closeModal();
    });
}


// --- 2. LÓGICA PARA O MODAL DE LEADS (INTENÇÃO DE SAÍDA) ---
function initLeadModal() {
    const leadModal = document.getElementById('leadModal');
    if (!leadModal) return;

    const closeLeadModal = document.getElementById('closeLeadModal');

    const showLeadModal = () => {
        // Só mostra se ainda não tiver sido mostrado nesta sessão
        if (!sessionStorage.getItem('leadModalShown')) {
            leadModal.classList.remove('hidden');
            sessionStorage.setItem('leadModalShown', 'true');
        }
    };

    // Ativa o modal quando o rato do utilizador se move para o topo da página
    document.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0) {
            showLeadModal();
        }
    });

    const closeLead = () => leadModal.classList.add('hidden');

    closeLeadModal.addEventListener('click', closeLead);
    leadModal.addEventListener('click', (e) => {
        if (e.target === leadModal) closeLead();
    });
}


// --- 3. LÓGICA PARA O CHAT DE QUALIFICAÇÃO ---
function initChat() {
    // Seleção de todos os elementos do chat
    const openChatBtn = document.getElementById('openChat');
    const closeChatBtn = document.getElementById('closeChat');
    const chatModal = document.getElementById('chatModal');
    const chatBody = document.getElementById('chatBody');
    const chatOptions = document.getElementById('chatOptions');
    const chatInputWrap = document.getElementById('chatInputWrap');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSend');

    if (!openChatBtn) return;

    // Estrutura da conversa
    const conversationFlow = [
        { q: 'Olá! 👋 Bem-vindo ao Programa de Alto Impacto. Qual o seu nível atual em programação?', type: 'options', options: ['Nenhum', 'Básico', 'Intermediário', 'Avançado'] },
        { q: 'Entendido. E qual é o seu maior objetivo ao aprender a programar?', type: 'text' },
        { q: 'Ótimo objetivo! Para finalizar, qual área mais lhe interessa?', type: 'options', options: ['Web', 'Mobile', 'Dados/IA', 'Não sei'] },
    ];

    let currentStep = 0;
    let userProfile = {};

    const openChat = () => {
        chatModal.classList.remove('hidden');
        openChatBtn.classList.add('hidden');
        startConversation();
    };

    const closeChat = () => {
        chatModal.classList.add('hidden');
        openChatBtn.classList.remove('hidden');
    };

    const startConversation = () => {
        currentStep = 0;
        userProfile = {};
        chatBody.innerHTML = '';
        showQuestion();
    };

    const showQuestion = () => {
        if (currentStep >= conversationFlow.length) {
            finishQualification();
            return;
        }

        const step = conversationFlow[currentStep];
        appendMessage(step.q, 'bot');

        if (step.type === 'options') {
            chatInputWrap.classList.add('hidden');
            chatOptions.innerHTML = '';
            step.options.forEach(option => {
                const btn = document.createElement('button');
                btn.textContent = option;
                btn.className = 'bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition-colors';
                btn.onclick = () => handleAnswer(option);
                chatOptions.appendChild(btn);
            });
        } else { // type 'text'
            chatOptions.innerHTML = '';
            chatInputWrap.classList.remove('hidden');
            chatInput.focus();
        }
    };

    const handleAnswer = (answer) => {
        if (!answer.trim()) return;

        const question = conversationFlow[currentStep].q;
        userProfile[question] = answer;
        
        appendMessage(answer, 'user');
        chatInput.value = '';
        currentStep++;

        setTimeout(showQuestion, 500); // Pequeno delay antes da próxima pergunta
    };
    
    const finishQualification = () => {
        chatInputWrap.classList.add('hidden');
        chatOptions.innerHTML = '';

        let summary = "Obrigado! O seu perfil foi qualificado.\n\nResumo:\n";
        for(const key in userProfile) {
            summary += `- ${key}: ${userProfile[key]}\n`;
        }
        
        appendMessage('Perfil qualificado com sucesso! Para continuar a conversa e finalizar a sua inscrição com um consultor, clique no botão abaixo.', 'bot');
        
        // Adiciona um botão para o WhatsApp com os dados pré-preenchidos
        const whatsappBtn = document.createElement('a');
        const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no Programa de Alto Impacto. Segue o meu perfil:\n${summary}`);
        whatsappBtn.href = `https://wa.me/+244976035050?text=${whatsappMessage}`; // SUBSTITUA O NÚMERO
        whatsappBtn.target = '_blank';
        whatsappBtn.textContent = 'Falar no WhatsApp';
        whatsappBtn.className = 'bg-green-500 text-white font-bold p-3 rounded mt-2 block text-center';
        chatBody.appendChild(whatsappBtn);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const appendMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        messageDiv.className = sender === 'bot' ? 'chat-message-bot' : 'chat-message-user';
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll para a última mensagem
    };

    // Event Listeners do Chat
    openChatBtn.addEventListener('click', openChat);
    closeChatBtn.addEventListener('click', closeChat);
    chatSendBtn.addEventListener('click', () => handleAnswer(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAnswer(chatInput.value);
    });
}


// --- 4. FUNÇÃO PRINCIPAL EXPORTADA ---
// Esta função é chamada pelo main.js para inicializar todos os modais.
export function initModals() {
    initIframeModal();
    initLeadModal();
    initChat();
}