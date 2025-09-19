// Define quem tem acesso para evitar abusos.
const SPREADSHEET_ID = "1FC9KoF7kjcLuyiNnyN_yRtLmqs3dqIfJA9wCoMfYSpE"; // Substitua pelo ID da sua folha.
const SHEET_NAME = "Alunos"; // Verifique se o nome da sua aba é este.

// Esta função é executada quando o formulário é enviado.
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Validação básica de segurança
    if (!data.nome || !data.email) {
      return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Nome e Email são obrigatórios." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const newRow = [
      new Date(),
      data.nome,
      data.email,
      data.telefone || "", // Usa "" se o campo for opcional
      data.nivel || ""
    ];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Inscrição recebida com sucesso!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}