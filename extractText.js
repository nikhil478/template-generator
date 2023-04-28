const pdfjsLib = require('pdfjs-dist');
const fs = require('fs');
const { Worker } = require('worker_threads');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf-worker.js';

async function extractText() {
  const pdfData = new Uint8Array(fs.readFileSync('E:/pdf-html/Input.pdf'));

  // Create a new worker
  const worker = new Worker(__dirname + '/pdf-worker.js', { workerData: pdfData });

  // Listen for messages from the worker
  const loadingTask = new Promise((resolve, reject) => {
    worker.on('message', message => {
      if (message.type === 'documentLoaded') {
        resolve(message.document);
      } else if (message.type === 'loadingError') {
        reject(message.error);
      }
    });
  });

  // Start the worker
  worker.postMessage({ type: 'loadDocument' });

  const pdfDocument = await loadingTask;

  const numPages = pdfDocument.numPages;

  let textWithPositionData = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);

    const textContent = await page.getTextContent();

    const pageTextWithPositionData = textContent.items.map(item => ({
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width,
      height: item.height,
      fontSize: item.transform[3],
      fontName: item.fontName
    }));

    textWithPositionData = [...textWithPositionData, ...pageTextWithPositionData];
  }

  // Terminate the worker
  worker.terminate();

  return textWithPositionData;
}

module.exports = extractText;
