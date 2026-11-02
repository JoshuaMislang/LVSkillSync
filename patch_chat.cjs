const fs = require('fs');
let code = fs.readFileSync('src/screens/Chat.tsx', 'utf-8');

// Add import for Camera
code = code.replace(
  "import { Message } from '../types';",
  "import { Message } from '../types';\nimport { Camera } from '@capacitor/camera';"
);

const startVideoOld = `      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });`;

const startVideoNew = `      const startVideo = async () => {
        try {
          // Request native permissions first via Capacitor
          const permissions = await Camera.requestPermissions();
          if (permissions.camera === 'denied') {
            console.warn("Camera permission was denied");
            setCameraError(true);
            return;
          }
          
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });`;

code = code.replace(startVideoOld, startVideoNew);
fs.writeFileSync('src/screens/Chat.tsx', code);
