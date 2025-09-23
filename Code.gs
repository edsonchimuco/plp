// Define quem tem acesso para evitar abusos.
const SPREADSHEET_ID = "1FC9KoF7kjcLuyiNnyN_yRtLmqs3dqIfJA9wCoMfYSpE"; // Substitua pelo ID da sua folha.
const SHEET_ALUNOS = "Alunos";
const SHEET_LEADS = "Leads";
const SHEET_DOWNLOADS = "Downloads"; 
const SHEET_FAQ_NAME = "FAQ_Data";

// Função principal que lida com todos os envios do site
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'submit_aluno'; // Define uma ação padrão

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === 'submit_aluno') {
      const sheet = ss.getSheetByName(SHEET_ALUNOS);
      const newRow = [new Date(), data.nome, data.email, data.telefone || "", data.nivel || ""];
      sheet.appendRow(newRow);
    } 
    else if (action === 'submit_lead') {
      const sheet = ss.getSheetByName(SHEET_LEADS);
      const newRow = [new Date(), data.contacto, data.duvida || ""];
      sheet.appendRow(newRow);
    }
    else if (action === 'track_download') {
      const sheet = ss.getSheetByName(SHEET_DOWNLOADS);
      sheet.appendRow([new Date()]); // Regista apenas a data e hora do download
    }

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(Content.MimeType.JSON);
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Carrega o conteúdo principal do site (textos, data do evento)
  const contentSheet = ss.getSheetByName(SHEET_CONTENT_NAME);
  const contentData = contentSheet.getDataRange().getValues();
  const siteContent = {};
  for (let i = 1; i < contentData.length; i++) {
    const id = contentData[i][0];
    const value = contentData[i][1];
    siteContent[id] = value;
  }

  // Carrega a base de dados de Perguntas e Respostas
  const faqSheet = ss.getSheetByName(SHEET_FAQ_NAME);
  const faqData = faqSheet.getDataRange().getValues();
  const faqItems = [];
  // Começa em i = 1 para ignorar a linha do cabeçalho
  for (let i = 1; i < faqData.length; i++) {
    // Verifica se a linha não está vazia
    if (faqData[i][0] && faqData[i][1] && faqData[i][2]) {
      faqItems.push({
        category: faqData[i][0],
        question: faqData[i][1],
        answer: faqData[i][2]
      });
    }
  }

  // Combina tudo num único objeto JSON
  const finalJson = {
    siteContent: siteContent,
    faqData: faqItems
  };
  
  return ContentService.createTextOutput(JSON.stringify(finalJson))
    .setMimeType(ContentService.MimeType.JSON);
}

const SHEET_LEADS_NAME = "Leads"; 

function doPost_Leads(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (!data.contacto) { return; } // Ignora se não houver contacto

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_LEADS_NAME);
    const newRow = [ new Date(), data.contacto, data.duvida || "" ];
    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // ...
  }
}