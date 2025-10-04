document.addEventListener('DOMContentLoaded', () => {

    // !!! IMPORTANTE !!! 
    // Substitua a URL abaixo pela URL de implantação do SEU NOVO Google Apps Script.
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbym4MklvLgjaBXqL-blUUl7bOgniWbOTKXB8m1kawkrky8idfZbG3SjrZlzvfl2lifK/exec"; 
    
    // --- ELEMENTOS DO DOM ---
    const downloadCard = document.getElementById('download-card');
    const loadingState = document.getElementById('loading-state');
    const downloadContent = document.getElementById('download-content');
    const deviceIcon = document.getElementById('device-icon');
    const deviceTitle = document.getElementById('device-title');
    const deviceDescription = document.getElementById('device-description');
    const downloadButton = document.getElementById('download-button');
    const buttonText = document.getElementById('button-text');

    // --- FUNÇÕES ---

    /**
     * Detecta o sistema operativo do utilizador.
     * @returns {string} O nome do sistema operativo.
     */
    function getOperatingSystem() {
        const userAgent = window.navigator.userAgent;
        if (userAgent.indexOf("Windows NT 10.0") !== -1) return "Windows 10/11";
        if (userAgent.indexOf("Windows NT 6.2") !== -1) return "Windows 8";
        if (userAgent.indexOf("Windows NT 6.1") !== -1) return "Windows 7";
        if (/Android/i.test(userAgent)) return "Android";
        if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
        if (/Mac/i.test(userAgent)) return "macOS";
        if (/Linux/i.test(userAgent)) return "Linux";
        return "Desconhecido";
    }

    /**
     * Atualiza a interface com base no dispositivo detetado.
     * @param {string} os - O sistema operativo detetado.
     */
    function updateUIForDevice(os) {
        let icon = 'hard-drive';
        let title = `Download para ${os}`;
        let description = "O aplicativo foi otimizado para o seu sistema.";
        let downloadLink = '#'; // Link de fallback

        switch (os) {
            case 'Android':
                icon = 'smartphone';
                description = "Clique abaixo para baixar o ficheiro APK para o seu Android.";
                downloadLink = 'https://example.com/app.apk'; // TODO: Substituir pelo link real do APK
                break;
            case 'iOS':
                icon = 'smartphone';
                title = "Disponível na App Store";
                description = "Em breve, o nosso aplicativo estará disponível para iOS.";
                downloadButton.classList.add('opacity-50', 'cursor-not-allowed');
                downloadButton.removeAttribute('href');
                break;
            case 'Windows 10/11':
            case 'Windows 8':
            case 'Windows 7':
                icon = 'monitor';
                description = "Clique para baixar a versão desktop para Windows.";
                downloadLink = 'https://example.com/app.exe'; // TODO: Substituir pelo link real do EXE
                break;
            case 'macOS':
                icon = 'monitor';
                description = "Clique para baixar a versão desktop para macOS.";
                downloadLink = 'https://example.com/app.dmg'; // TODO: Substituir pelo link real do DMG
                break;
            case 'Linux':
                icon = 'terminal';
                description = "Clique para baixar a versão para Linux.";
                downloadLink = 'https://example.com/app.tar.gz'; // TODO: Substituir pelo link real do TAR.GZ
                break;
            default:
                 title = "Download Indisponível";
                 description = "Não conseguimos identificar o seu sistema. Por favor, tente noutro dispositivo.";
                 downloadButton.classList.add('opacity-50', 'cursor-not-allowed');
                 downloadButton.removeAttribute('href');
        }
        
        deviceIcon.setAttribute('data-feather', icon);
        feather.replace(); // É preciso chamar de novo para renderizar o novo ícone
        deviceTitle.textContent = title;
        deviceDescription.textContent = description;
        if (downloadLink !== '#') {
            downloadButton.href = downloadLink;
        }

        // Exibe o conteúdo
        loadingState.classList.add('hidden');
        downloadContent.classList.remove('hidden');
    }

    /**
     * Envia os dados de rastreamento para a planilha do Google.
     * @param {string} deviceType - O tipo de dispositivo a ser registado.
     */
    async function trackDownload(deviceType) {
        if (SCRIPT_URL === "URL_DO_SEU_NOVO_SCRIPT_DE_DOWNLOAD_AQUI") {
            console.warn("AVISO: A URL do script de rastreamento não foi configurada no ficheiro app.js.");
            return;
        }
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para evitar erros de CORS com o Google Scripts
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'track_app_download',
                    device: deviceType 
                }),
                redirect: 'follow'
            });
            console.log('Evento de download registado com sucesso para:', deviceType);
        } catch (error) {
            console.error("Falha ao registar o evento de download:", error);
        }
    }


    // --- INICIALIZAÇÃO ---

    // Efeito de entrada
    setTimeout(() => {
        downloadCard.classList.remove('scale-95', 'opacity-0');
        downloadCard.classList.add('scale-100', 'opacity-100');
    }, 100);

    // Simula um pequeno atraso para a deteção, melhorando a UX
    setTimeout(() => {
        const userOS = getOperatingSystem();
        updateUIForDevice(userOS);

        // Adiciona o evento de clique APÓS a UI estar pronta
        if (downloadButton.hasAttribute('href')) {
            downloadButton.addEventListener('click', (e) => {
                // Previne o download imediato para dar tempo de registar o evento
                e.preventDefault(); 
                
                trackDownload(userOS);

                buttonText.textContent = "A iniciar...";

                // Após um pequeno atraso, inicia o download real e restaura o botão
                setTimeout(() => {
                    window.location.href = downloadButton.href;
                    setTimeout(() => {
                        buttonText.textContent = "Fazer Download";
                    }, 2000);
                }, 500);
            });
        }

    }, 1500);

});

