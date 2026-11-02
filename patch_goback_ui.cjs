const fs = require('fs');

const filesToPatch = [
  'src/screens/Chat.tsx',
  'src/screens/Settings.tsx',
  'src/screens/Premium.tsx',
  'src/screens/Calculator.tsx',
  'src/screens/JobDetails.tsx'
];

filesToPatch.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');
  
  if (!code.includes('const { goBack }')) {
    code = code.replace(
      /const \{[\s\S]*?setCurrentScreen[\s\S]*?\} = useAppContext\(\);/,
      match => match.replace('setCurrentScreen', 'setCurrentScreen, goBack')
    );
  }
  
  // Specifically for buttons
  code = code.replace(
    /onClick=\{\(\) => setCurrentScreen\('Main'\)\}/g,
    "onClick={() => goBack()}"
  );

  // JobDetails specific success return
  code = code.replace(
    /setCurrentScreen\('Main'\);\s*\}, 2000\);/g,
    "goBack();\n    }, 2000);"
  );

  // Premium specific success return
  code = code.replace(
    /setCurrentScreen\('Main'\);\s*\}, 2500\);/g,
    "goBack();\n    }, 2500);"
  );

  fs.writeFileSync(file, code);
});
console.log('Patched UI back buttons');
