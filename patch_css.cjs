const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

const darkModeCSS = `
.dark {
  --color-background: #111827;
  --color-card: #1F2937;
  --color-text-dark: #F9FAFB;
}

body.dark {
  background-color: #000;
}
`;

if (!css.includes('.dark {')) {
  css = css.replace('}body {', '} ' + darkModeCSS + 'body {');
  fs.writeFileSync('src/index.css', css);
}
