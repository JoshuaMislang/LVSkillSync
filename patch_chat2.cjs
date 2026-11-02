const fs = require('fs');
let code = fs.readFileSync('src/screens/Chat.tsx', 'utf-8');

const hookRegex = /const messagesEndRef = useRef<HTMLDivElement>\(null\);/;
const hookReplacement = `const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isVideoCalling) {
      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };
      startVideo();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoCalling]);`;
code = code.replace(hookRegex, hookReplacement);

const videoElementRegex = /<div className="absolute inset-0 bg-gray-800 flex items-center justify-center">\s*<User className="w-32 h-32 text-gray-600" \/>\s*<\/div>/;
const videoElementReplacement = `<div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>`;
code = code.replace(videoElementRegex, videoElementReplacement);

fs.writeFileSync('src/screens/Chat.tsx', code);
