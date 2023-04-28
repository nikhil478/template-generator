const { PDFExtract } = require('pdf.js-extract');
const fs = require('fs');

async function pdfWorker(pdfBytes) {
  try {
    const pdfExtract = new PDFExtract();
    const { text } = await pdfExtract.extractBuffer(pdfBytes, {});
    return text;
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
}

async function testPdfWorker() {
  try {
    const pdfBytes = await fs.promises.readFile('Mantis.pdf');
    console.log(pdfBytes);
    const textWithPositionData = await pdfWorker(pdfBytes);
    console.log(textWithPositionData);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

testPdfWorker();