const Handlebars = require('handlebars');
const extractText = require('./extractText');
const fs = require('fs');

// Compile the Handlebars template
const source = `
  <div class="pdf-template">
    {{#each textWithPositionData}}
      <div class="pdf-text" style="left:{{this.x}}px;top:{{this.y}}px;width:{{this.width}}px;height:{{this.height}}px;font-size:{{this.fontSize}}px;font-family:{{this.fontName}}">
        {{this.text}}
      </div>
    {{/each}}
  </div>
`;
const template = Handlebars.compile(source);

async function generateTemplate() {
  try {
    const textWithPositionData = await extractText();
    console.log(textWithPositionData);
    const html = template({ textWithPositionData });
    console.log(html);
    fs.writeFileSync('E:/pdf-html/file.html', html);
    console.log('HTML file successfully generated');
  } catch (error) {
    console.error(error);
  }
}
generateTemplate();
module.exports = generateTemplate;
