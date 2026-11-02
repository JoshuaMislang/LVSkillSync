import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneOff, MicOff, CameraOff, ShieldCheck } from 'lucide-react';
import { Message } from '../types';
import { Camera } from '@capacitor/camera';

export default function Chat() {
  const { selectedChat, goBack, getMessages, sendMessage, markThreadAsRead, isThreadTyping, messageThreads } = useAppContext();
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const isClientTyping = selectedChat ? isThreadTyping(selectedChat.id) : false;
  const [cameraError, setCameraError] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (selectedChat) {
      const activeInList = messageThreads.find(t => t.id === selectedChat.id);
      if (activeInList?.unread || selectedChat.unread) {
        markThreadAsRead(selectedChat.id);
      }
    }
  }, [selectedChat, messageThreads, markThreadAsRead]);

  useEffect(() => {
    if (isVideoCalling) {
      setCameraError(false);
      const startVideo = async () => {
        try {
          await Camera.requestPermissions({ permissions: ['camera'] });
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;

            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch(playErr => {
                console.error("video.play() failed:", playErr);
              });
            };
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setCameraError(true);
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
  }, [isVideoCalling]);

  const messages = selectedChat ? getMessages(selectedChat.id) : [];

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length, isClientTyping]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedChat) return;
    sendMessage(selectedChat.id, inputText);
    setInputText('');
  };

  const toggleCamera = () => {
    if (!streamRef.current) return;

    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setCameraEnabled(videoTrack.enabled);
  };

  if (!selectedChat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-50 dark:bg-[#0B132B]">
        <button
          onClick={() => goBack()}
          className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#111E38] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Messages</span>
        </button>
        <p className="text-sm font-semibold text-slate-800 dark:text-white">No active conversation selected</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a chat from your messages inbox to view the log.</p>
      </div>
    );
  }

  return (
    <motion.div 
      id="chat-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-[#0B132B] relative"
    >
      {/* Top Header */}
      <div className="w-full bg-white/95 dark:bg-[#111E38]/95 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <button 
              id="chat-back-btn"
              onClick={() => goBack()}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  src={selectedChat.avatar} 
                  alt={selectedChat.name} 
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800" 
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111E38]" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-tight">
                  {selectedChat.name}
                </h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium leading-none">
                    Verified Client
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsCalling(true)} 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsVideoCalling(true)} 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
            >
              <Video className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full space-y-3 pb-24">
        {/* Safety tip banner */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300 flex items-center justify-between">
          <span className="leading-relaxed">
            🛡️ Keep conversations inside LVSkillSync to ensure milestone protection.
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'u1';
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-xs leading-relaxed ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-[#111E38] border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm'
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
        {isClientTyping && (
          <div className="flex flex-col items-start">
            <div className="bg-white dark:bg-[#111E38] border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-1 font-medium">{selectedChat.name} is typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#111E38]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 p-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] z-20 shadow-[0_-4px_16px_rgba(11,25,44,0.06)]">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message or ask a question..."
            className="flex-1 bg-slate-100 dark:bg-[#0B132B] border border-transparent focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
          />
          <button 
            onClick={handleSend}
            id="chat-send-btn"
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              inputText.trim() 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Call Overlay */}
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B192C]/95 backdrop-blur-md flex flex-col items-center justify-between py-12 px-6 max-w-lg mx-auto text-white rounded-3xl my-auto h-[90vh]"
          >
            <div className="flex flex-col items-center mt-12">
              <div className="relative mb-6">
                <img 
                  src={selectedChat.avatar} 
                  alt={selectedChat.name} 
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-blue-500/40" 
                />
                <span className="absolute inset-0 rounded-2xl animate-ping ring-2 ring-blue-400 opacity-20 pointer-events-none" />
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white mb-1">
                {selectedChat.name}
              </h2>
              <p className="text-blue-300 text-xs font-semibold tracking-wider uppercase">
                Student Consultation Call
              </p>
            </div>
            
            <div className="flex items-center gap-6 mb-8">
              <button className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors">
                <MicOff className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsCalling(false)}
                className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center text-white hover:bg-rose-700 shadow-lg shadow-rose-900/40 transition-colors"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Call Overlay */}
      <AnimatePresence>
        {isVideoCalling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 overflow-hidden bg-black max-w-2xl mx-auto rounded-3xl my-auto h-[90vh] shadow-2xl border border-slate-700"
          >
            {cameraError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0B192C]">
                <div className="text-center px-6">
                  <CameraOff className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-white text-sm font-semibold">Camera Access Required</p>
                  <p className="text-xs text-slate-400 mt-1">Please enable camera permission to start student video consults.</p>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

            <div className="absolute top-8 left-5 z-10">
              <h2 className="font-heading font-extrabold text-xl text-white">
                {selectedChat.name}
              </h2>
              <p className="text-xs text-blue-300 font-medium">Connecting video consult...</p>
            </div>

            <div className="absolute top-8 right-5 z-10 w-24 h-32 rounded-xl overflow-hidden border-2 border-white/40 shadow-xl bg-slate-900">
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center items-center gap-5">
              <button
                onClick={toggleCamera}
                className={`w-14 h-14 rounded-2xl backdrop-blur-md flex items-center justify-center transition-colors ${
                  cameraEnabled ? "bg-black/60 text-white border border-white/20" : "bg-rose-600 text-white"
                }`}
              >
                {cameraEnabled ? <CameraOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              </button>

              <button className="w-14 h-14 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                <MicOff className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsVideoCalling(false)}
                className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg hover:bg-rose-700 transition-colors"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
