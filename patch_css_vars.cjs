const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

if (!css.includes('.dark {')) {
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
  css = css.replace('@theme {', darkModeCSS + '\n@theme {');
  fs.writeFileSync('src/index.css', css);
}
