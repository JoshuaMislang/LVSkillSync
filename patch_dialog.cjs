const fs = require('fs');
let code = fs.readFileSync('src/AppContext.tsx', 'utf-8');

const regex = /import\('@capacitor\/app'\)\.then\(\(\{ App \}\) => App\.exitApp\(\)\);/g;

const replacement = `import('@capacitor/dialog').then(({ Dialog }) => {
            Dialog.confirm({
              title: 'Exit App',
              message: 'Are you sure you want to exit?',
            }).then(({ value }) => {
              if (value) {
                import('@capacitor/app').then(({ App }) => App.exitApp());
              }
            });
          });`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/AppContext.tsx', code);
