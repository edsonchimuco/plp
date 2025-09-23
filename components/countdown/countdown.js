// Ficheiro: /components/countdown/countdown.js
import { setHeaderTop } from '../header/header.js';

let intervalId = null;

function hideCountdownBar() {
    const topBar = document.getElementById('topMessageBar');
    if (topBar) topBar.style.transform = 'translateY(-100%)';
    setHeaderTop(false); // Avisa o header para subir
}

function startCountdown(targetDate) {
    const topBarText = document.getElementById('topMessageText');
    if (!topBarText) return;

    if (isNaN(targetDate.getTime())) {
        topBarText.textContent = "Data do evento inválida.";
        setTimeout(hideCountdownBar, 2000); 
        return;
    }

    intervalId = setInterval(() => {
        // ... (lógica do contador, igual à anterior)
    }, 1000);
}

export function initCountdown(eventDate) {
    // Inicia o header na posição correta
    setHeaderTop(true);
    startCountdown(new Date(eventDate));
}