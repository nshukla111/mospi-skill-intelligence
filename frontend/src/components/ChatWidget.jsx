import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  ExternalLink,
  ChevronRight,
  Zap
} from 'lucide-react';
import { sendChatMessage } from '../services/api';

export default function ChatWidget({ activeEmployee, onTriggerQuiz, onOpenTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Namaste! I am your **Karmayogi Statistical AI Assistant**. I am connected to MoSPI's Competency Taxonomy and NSSTA/iGOT training engines. How may I help you today?`,
      time: 'Just now',
      actions: ['Analyze My Skill Gaps', 'Generate 5-Min Quiz', 'Recommend Courses', 'NSSTA Workshops']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (textToSend = null) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(text, activeEmployee?.id || 1);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: res.suggested_actions || [],
        links: res.related_links || []
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: "I am ready to assist. You can explore your Skill Gap Radar or start a domain competency quiz!",
          time: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (actionText) => {
    if (actionText.includes('Quiz') && onTriggerQuiz) {
      onTriggerQuiz();
    } else if (actionText.includes('Course') && onOpenTab) {
      onOpenTab('courses');
    } else {
      handleSend(actionText);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      
      {/* Closed Floating Pill Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 text-white font-semibold text-xs shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all duration-200 border border-cyan-400/40"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          </div>
          <span className="font-bold">Ask Karmayogi AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      )}

      {/* Opened Chat Dialog */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[540px] max-h-[85vh] glass-card rounded-3xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                  Karmayogi Statistical AI
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    ONLINE
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Context: {activeEmployee?.name || 'Officer'} ({activeEmployee?.designation || 'MoSPI'})
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start space-x-2 max-w-[85%]">
                  {msg.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Action Chips */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                        {msg.actions.map((act, aidx) => (
                          <button
                            key={aidx}
                            onClick={() => handleActionClick(act)}
                            className="text-[10px] px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-900/60 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all font-medium flex items-center gap-1"
                          >
                            <Zap className="w-2.5 h-2.5" />
                            {act}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <div className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-cyan-400 animate-spin" />
                </div>
                <span className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 italic">
                  Analyzing statistical taxonomy & training data...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your gaps, courses, or SNA/CPI..."
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
