import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { Search, CheckCheck, Sparkles, ShieldCheck, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function Messages() {
  const { setCurrentScreen, setSelectedChat, selectedChat, messageThreads, markThreadAsRead, getMessages, sendMessage, isThreadTyping } = useAppContext();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [inputText, setInputText] = useState('');
  const isClientTyping = selectedChat ? isThreadTyping(selectedChat.id) : false;
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);

  // Keep window scrolled to top when Messages screen mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Default selected chat on desktop if none selected
  useEffect(() => {
    if (!selectedChat && messageThreads.length > 0 && window.innerWidth >= 1024) {
      setSelectedChat(messageThreads[0]);
    }
  }, [selectedChat, messageThreads, setSelectedChat]);

  // When staying in the currently messaged conversation, automatically mark as read
  useEffect(() => {
    if (selectedChat) {
      const activeInList = messageThreads.find(t => t.id === selectedChat.id);
      if (activeInList?.unread || selectedChat.unread) {
        markThreadAsRead(selectedChat.id);
      }
    }
  }, [selectedChat, messageThreads, markThreadAsRead]);

  const unreadCount = messageThreads.filter(m => m.unread).length;

  const filteredMessages = messageThreads.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(search.toLowerCase()) || 
      msg.lastMessage.toLowerCase().includes(search.toLowerCase());
    if (filter === 'unread') return matchesSearch && msg.unread;
    return matchesSearch;
  });

  const activeMessages = selectedChat ? getMessages(selectedChat.id) : [];

  // Safely scroll internal chat messages container without triggering page-level scrolling
  useEffect(() => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTop = chatMessagesContainerRef.current.scrollHeight;
    }
  }, [activeMessages.length, isClientTyping, selectedChat?.id]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedChat) return;
    sendMessage(selectedChat.id, inputText);
    setInputText('');
  };

  return (
    <div id="messages-screen" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12 bg-slate-50 dark:bg-[#0B132B] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-5 pt-1">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-[#0B192C] dark:text-white tracking-tight">
            Messages
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chat with clients and project collaborators.
          </p>
        </div>
      </div>

      {/* Desktop Split-Pane Layout / Mobile Stack Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Thread List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111E38] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
              placeholder="Search messages..."
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#111E38] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              All ({messageThreads.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#111E38] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          </div>

          {/* Conversations List */}
          <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => {
                const isSelected = selectedChat?.id === msg.id;
                return (
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (msg.unread) {
                        markThreadAsRead(msg.id);
                      }
                      setSelectedChat({ ...msg, unread: false });
                      if (window.innerWidth < 1024) {
                        setCurrentScreen('Chat');
                      }
                    }}
                    key={msg.id} 
                    className={`p-3.5 rounded-2xl shadow-sm border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected && window.innerWidth >= 1024
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/20'
                        : msg.unread 
                        ? 'bg-white dark:bg-[#111E38] border-blue-200 dark:border-blue-900/60 ring-1 ring-blue-500/10' 
                        : 'bg-white dark:bg-[#111E38] border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={msg.avatar} 
                        alt={msg.name} 
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800" 
                      />
                      {msg.unread ? (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white dark:border-[#111E38]" />
                      ) : (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111E38]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`font-heading text-sm truncate ${
                          msg.unread 
                            ? 'font-bold text-[#0B192C] dark:text-white' 
                            : 'font-semibold text-slate-800 dark:text-slate-200'
                        }`}>
                          {msg.name}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium ml-2 flex-shrink-0">
                          {msg.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        {isThreadTyping(msg.id) ? (
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium italic animate-pulse flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 inline-block animate-ping" />
                            typing...
                          </p>
                        ) : (
                          <p className={`text-xs truncate ${
                            msg.unread 
                              ? 'text-slate-900 dark:text-slate-100 font-medium' 
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {msg.lastMessage}
                          </p>
                        )}
                        {!msg.unread && !isThreadTyping(msg.id) && (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 px-6 bg-white dark:bg-[#111E38] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  No conversations found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Apply to student gigs to start chatting.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Desktop Active Chat Panel (Hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-7 bg-white dark:bg-[#111E38] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)]">
          {selectedChat ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/95 dark:bg-[#111E38]/95 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={selectedChat.avatar} 
                      alt={selectedChat.name} 
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800" 
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111E38]" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                      {selectedChat.name}
                    </h2>
                    <div className="flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Verified Client
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => {
                      setSelectedChat(selectedChat);
                      setCurrentScreen('Chat');
                    }}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Open Fullscreen Call / Chat
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={chatMessagesContainerRef} 
                className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50 dark:bg-[#070D1F]/50"
              >
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300">
                  🛡️ Student Escrow Protection active. Keep deliverables inside LVSkillSync.
                </div>
                {activeMessages.map((msg) => {
                  const isMe = msg.senderId === 'u1';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-xs leading-relaxed ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-sm' 
                          : 'bg-white dark:bg-[#111E38] border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm'
                      }`}>
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
              <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111E38]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message to client..."
                    className="flex-1 bg-slate-100 dark:bg-[#0B132B] border border-transparent focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
                  />
                  <button 
                    onClick={handleSend}
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Sparkles className="w-10 h-10 text-blue-500 mb-3 opacity-80" />
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Select a conversation
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Choose a client thread from the left panel to start messaging in split-pane view.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
