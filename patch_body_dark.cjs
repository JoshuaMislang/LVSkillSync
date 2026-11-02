const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code = code.replace('body.dark {', 'html.dark body {');

fs.writeFileSync('src/index.css', code);
