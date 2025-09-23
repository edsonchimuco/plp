// Ficheiro: assets/js/main.js

/* -------------------------------
   Inicialização de Bibliotecas
   ------------------------------- */
AOS.init({ duration: 700, once: true });
feather.replace();
try {
  VANTA.NET({ el: "#vanta-bg", color: 0x00ff88, backgroundColor: 0x070707, points: 12, maxDistance: 20 });
} catch (e) {
  console.warn('Vanta failed', e);
}

/* -------------------------------
   Menu Mobile
   ------------------------------- */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

/* -------------------------------
   Notificação Toast
   ------------------------------- */
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'fixed left-1/2 -translate-x-1/2 bottom-8 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// Ficheiro: assets/js/main.js (adicionar este bloco)

const topBar = document.getElementById('topMessageBar');
const topBarText = document.getElementById('topMessageText');

function showTopMessage(message, duration = 4000) {
  topBarText.textContent = message;
  topBar.classList.remove('hidden', '-translate-y-full');
  
  setTimeout(() => {
    topBar.classList.add('-translate-y-full');
  }, duration);
}

// Exemplo de uso: Mostrar uma mensagem 3 segundos depois da página carregar.
window.addEventListener('load', () => {
  setTimeout(() => {
    showTopMessage('Bem-vindo ao Programa de Alto Impacto!');
  }, 3000);
});

/* -------------------------------
   Lógica de Envio do Formulário
   ------------------------------- */
const waitlistForm = document.getElementById('waitlistForm');
// !! IMPORTANTE: Verifique se este URL é o URL da SUA implementação do Apps Script !!
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhTzlwqtKphxxWxeP0qGiNCXEN8-5pQCZWP8Y5RUu3H-UWVKWIQrmLunVNjMpdTkEBPA/exec";

waitlistForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitButton = waitlistForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'A enviar...';
  submitButton.disabled = true;

  const formData = new FormData(waitlistForm);
  const data = Object.fromEntries(formData.entries());

  try {
    // Usamos text/plain porque o Apps Script lida melhor com o corpo da requisição assim
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
      redirect: 'follow'
    });

    // O Apps Script Web App pode retornar uma resposta de redirecionamento, que o `fetch` não segue por padrão no modo 'cors'.
    // O importante é que a requisição seja enviada. Verificamos o sucesso pela planilha.
    
    showToast('Inscrição recebida com sucesso! Entraremos em contacto.');
    waitlistForm.reset();

  } catch (error) {
    console.error('Fetch Error:', error);
    showToast(`Ocorreu um erro. Tente novamente.`);
  } finally {
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
});


/* -------------------------------
   Botões e Links
   ------------------------------- */
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.getElementById('heroJoin').addEventListener('click', scrollToTop);
document.getElementById('openWaitlist').addEventListener('click', scrollToTop);
document.getElementById('openWaitlistMobile').addEventListener('click', scrollToTop);
document.getElementById('openChat').addEventListener('click', () => openChatModal());
document.getElementById('openChatMobile').addEventListener('click', () => openChatModal());



/* -------------------------------
       Chat qualification flow
       ------------------------------- */
    const chatModal = document.getElementById('chatModal');
    const chatBody = document.getElementById('chatBody');
    const chatOptions = document.getElementById('chatOptions');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const closeChat = document.getElementById('closeChat');

    const flow = [
      { q: 'Qual é o seu nível de experiência com programação?', type:'options', options:['Nenhuma','Básico','Intermediário','Avançado'] },
      { q: 'Qual área mais te interessa?', type:'options', options:['Web','Mobile','Ciência de Dados/IA','Jogos','Sem certeza'] },
      { q: 'Qual seu objetivo ao aprender (ex: emprego, projeto pessoal)?', type:'text' },
      { q: 'Quantas horas por semana pode dedicar?', type:'options', options:['<5','5-10','10-20','>20'] }
    ];
    let current = 0; let profile = {};

    function openChatModal(){ chatModal.classList.remove('hidden'); current=0; profile={}; chatBody.innerHTML=''; showQuestion(); }
    function closeChatModal(){ chatModal.classList.add('hidden'); }
    closeChat.addEventListener('click', closeChatModal);

    function showQuestion(){
      const step = flow[current];
      const bot = document.createElement('div'); bot.className='bg-gray-700 text-white p-3 rounded mb-3 max-w-xs'; bot.textContent = step.q; chatBody.appendChild(bot);
      chatBody.scrollTop = chatBody.scrollHeight;
      if(step.type==='options'){
        chatOptions.innerHTML=''; chatOptions.classList.remove('hidden'); document.getElementById('chatInputWrap').style.display='none';
        step.options.forEach(opt=>{
          const btn = document.createElement('button'); btn.className='px-2 py-2 rounded bg-gray-600'; btn.textContent=opt;
          btn.addEventListener('click', ()=>{ addUserAnswer(opt); }); chatOptions.appendChild(btn);
        });
      }else{
        chatOptions.classList.add('hidden'); document.getElementById('chatInputWrap').style.display='flex'; chatInput.focus();
      }
    }

    function addUserAnswer(ans){
      const u = document.createElement('div'); u.className='bg-electric-green text-black p-3 rounded mb-3 ml-auto max-w-xs'; u.textContent=ans; chatBody.appendChild(u);
      profile[flow[current].q] = ans; current++;
      chatOptions.classList.add('hidden'); document.getElementById('chatInputWrap').style.display='none';
      if(current < flow.length){ setTimeout(showQuestion,500); } else { finishQualification(); }
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    chatSend.addEventListener('click', ()=>{
      const val = chatInput.value.trim(); if(!val) return;
      addUserAnswer(val);
      chatInput.value='';
    });
     chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            chatSend.click();
        }
    });

    function finishQualification(){
      const bot = document.createElement('div'); bot.className='bg-green-900 text-white p-3 rounded mb-3'; bot.innerHTML='Obrigado! O seu perfil foi qualificado com sucesso. <br><br>Entraremos em contacto em breve com mais informações.'; chatBody.appendChild(bot);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

/* -------------------------------
   Lógica do Carrossel
   ------------------------------- */
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const dotsWrap = document.getElementById('dots');
    let idx = 0; const total = slides.length;

    function buildDots(){ dotsWrap.innerHTML = ''; for(let i=0;i<total;i++){ const d = document.createElement('button'); d.className='w-3 h-3 rounded-full bg-gray-600 transition-colors'; d.addEventListener('click', ()=>goTo(i)); dotsWrap.appendChild(d);} updateDots(); }
    function updateDots(){ Array.from(dotsWrap.children).forEach((d,i)=>{ d.classList.toggle('bg-electric-green', i===idx); d.classList.toggle('bg-gray-600', i!==idx); }); }
    function goTo(i){ idx = i; track.style.transform = `translateX(-${idx*100}%)`; updateDots(); }
    document.getElementById('nextSlide').addEventListener('click', ()=> goTo((idx+1)%total));
    document.getElementById('prevSlide').addEventListener('click', ()=> goTo((idx-1+total)%total));
    buildDots();
    setInterval(()=> goTo((idx+1)%total), 4500);


    // Ficheiro: assets/js/main.js (adicionar este bloco)

    const leadModal = document.getElementById('leadModal');
    const closeLeadModal = document.getElementById('closeLeadModal');
    const leadForm = document.getElementById('leadForm');
    // !! IMPORTANTE: Este será um NOVO URL para uma NOVA função no seu Apps Script !!
    const LEAD_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhTzlwqtKphxxWxeP0qGiNCXEN8-5pQCZWP8Y5RUu3H-UWVKWIQrmLunVNjMpdTkEBPA/exec"; 

    // Mostrar o modal na intenção de saída
    document.addEventListener('mouseout', (e) => {
      // Se o rato sair do topo da página e o modal ainda não foi mostrado
      if (e.clientY <= 0 && !sessionStorage.getItem('leadModalShown')) {
        leadModal.classList.remove('hidden');
        sessionStorage.setItem('leadModalShown', 'true'); // Evita mostrar de novo na mesma sessão
      }
    });

    closeLeadModal.addEventListener('click', () => {
      leadModal.classList.add('hidden');
    });

    // Enviar os dados do lead
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // (Lógica de envio similar ao formulário principal, mas usando LEAD_SCRIPT_URL)
        // ...
        showToast('Contacto recebido! Falaremos consigo em breve.');
        leadForm.reset();
        setTimeout(() => leadModal.classList.add('hidden'), 500);
    });


    // Funcoa para buscar o conteudo dinamicamente
      const CONTENT_URL = "https://script.google.com/macros/s/AKfycbzhTzlwqtKphxxWxeP0qGiNCXEN8-5pQCZWP8Y5RUu3H-UWVKWIQrmLunVNjMpdTkEBPA/exec";

    async function loadDynamicContent() {
      try {
        const response = await fetch(CONTENT_URL);
        const content = await response.json();

        // Itera sobre o conteúdo e preenche os elementos
        for (const id in content) {
          const element = document.getElementById(id);
          if (element) {
            element.textContent = content[id];
          }
        }
      } catch (error) {
        console.error("Erro ao carregar conteúdo dinâmico:", error);
      }
    }

    // Chamar a função quando a página carregar
    document.addEventListener('DOMContentLoaded', loadDynamicContent);