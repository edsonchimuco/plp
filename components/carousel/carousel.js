// Ficheiro: /components/carousel/carousel.js

/**
 * Função principal que inicializa toda a lógica do carrossel.
 * Será chamada pelo main.js.
 */
export function initCarousel() {
    // --- 1. SELEÇÃO DOS ELEMENTOS DO DOM ---
    const carouselContainer = document.getElementById('carousel-container');
    
    // Se o carrossel não existir na página, não faz nada.
    if (!carouselContainer) {
        return;
    }

    const carouselTrack = document.getElementById('carouselTrack');
    const slides = Array.from(carouselTrack.children);
    const totalSlides = slides.length;
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('dots');

    // --- 2. VARIÁVEIS DE ESTADO ---
    let currentIndex = 0;
    let autoSlideInterval = null;

    // Variáveis para a funcionalidade de arrastar/swipe
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // --- 3. FUNÇÕES PRINCIPAIS ---

    /**
     * Move o carrossel para um slide específico.
     * @param {number} index - O índice do slide para o qual mover.
     */
    function goToSlide(index) {
        // Garante que o índice esteja sempre dentro dos limites (0 a totalSlides - 1)
        currentIndex = (index + totalSlides) % totalSlides;
        
        // Calcula a posição de translação e aplica ao track
        const offset = -currentIndex * carouselTrack.offsetWidth;
        carouselTrack.style.transform = `translateX(${offset}px)`;
        
        updateDots();
        resetAutoSlide();
    }

    /**
     * Atualiza os pontos de navegação para refletir o slide atual.
     */
    function updateDots() {
        if (!dotsContainer) return;
        Array.from(dotsContainer.children).forEach((dot, index) => {
            dot.classList.toggle('bg-electric-green', index === currentIndex);
            dot.classList.toggle('bg-gray-600', index !== currentIndex);
        });
    }

    /**
     * Reinicia o temporizador para o avanço automático.
     */
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    }

    // --- 4. LÓGICA DE ARRASTAR (SWIPE) ---

    function dragStart(e) {
        isDragging = true;
        // Obtém a posição inicial do clique ou do toque
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        
        // Remove a transição CSS para um movimento de arrasto suave
        carouselTrack.style.transition = 'none';
        
        // Pausa o avanço automático
        clearInterval(autoSlideInterval);

        // Inicia o loop de animação para o movimento
        animationID = requestAnimationFrame(animation);
    }

    function dragMove(e) {
        if (!isDragging) return;
        // Calcula o quanto o dedo/rato se moveu e atualiza a posição do track
        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        // Para o loop de animação
        cancelAnimationFrame(animationID);

        // Calcula a distância que foi movida
        const movedBy = currentTranslate - prevTranslate;

        // Se o movimento for significativo (mais de 100px), muda de slide
        if (movedBy < -100 && currentIndex < totalSlides - 1) {
            currentIndex += 1;
        }
        if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        // Aplica a posição final com uma transição suave
        setPositionByIndex();
        
        // Reinicia o avanço automático
        resetAutoSlide();
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        currentTranslate = currentIndex * -carouselTrack.offsetWidth;
        prevTranslate = currentTranslate;
        carouselTrack.style.transition = 'transform 0.45s ease-out';
        setSliderPosition();
        updateDots();
    }


    // --- 5. INICIALIZAÇÃO E EVENT LISTENERS ---

    // Cria os pontos de navegação dinamicamente
    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-gray-600', 'transition-colors');
            dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Eventos para os botões de seta
    if (prevButton) prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextButton) nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    // Eventos para a funcionalidade de arrastar
    carouselTrack.addEventListener('mousedown', dragStart);
    carouselTrack.addEventListener('touchstart', dragStart, { passive: true });

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('touchmove', dragMove, { passive: true });

    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
    
    // Previne comportamento padrão do navegador ao arrastar imagens
    slides.forEach(slide => {
        slide.querySelector('img').addEventListener('dragstart', (e) => e.preventDefault());
    });
    
    // Inicia o carrossel
    updateDots();
    resetAutoSlide();

    // Ajusta a posição ao redimensionar a janela
    window.addEventListener('resize', setPositionByIndex);
}