const fs = require('fs');
let code = fs.readFileSync('src/AppContext.tsx', 'utf-8');

code = code.replace(
  "import { createContext, useContext, useState, useEffect, ReactNode } from 'react';",
  "import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';"
);

code = code.replace(
  "const setCurrentScreen = (screen: Screen) => {",
  "const setCurrentScreen = useCallback((screen: Screen) => {"
);
code = code.replace(
  "    });\n  };\n\n  const setCurrentTab = (tab: Tab) => {",
  "    });\n  }, []);\n\n  const setCurrentTab = useCallback((tab: Tab) => {"
);
code = code.replace(
  "    });\n  };\n\n  const goBack = () => {",
  "    });\n  }, []);\n\n  const goBack = useCallback(() => {"
);
code = code.replace(
  "    });\n  };\n\n  // Apply theme to document",
  "    });\n  }, []);\n\n  // Apply theme to document"
);

fs.writeFileSync('src/AppContext.tsx', code);
