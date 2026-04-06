
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, MessageRole } from '../types';

interface MessageItemProps {
  message: Message;
}

// Function to detect and format phone numbers
const formatMessageWithCallButtons = (content: string) => {
  // Detect Indian phone numbers (10 digits)
  const phoneRegex = /(\d{10})/g;
  const parts = content.split(phoneRegex);
  
  return parts.map((part, index) => {
    if (part.match(/^\d{10}$/)) {
      return (
        <a
          key={index}
          href={`tel:+91${part}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all mx-1 border border-green-500/30"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <i className="fa-solid fa-phone"></i>
          {part}
          <span className="text-xs opacity-75">(Tap to call)</span>
        </a>
      );
    }
    return part;
  });
};

export const MessageItem: React.FC<MessageItemProps> = React.memo(({ message }) => {
  const isLeonux = message.role === MessageRole.LEONUX;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const baseUrl = import.meta.env.BASE_URL || '/';

  const handleSpeak = () => {
    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Clean the text by removing markdown formatting
      let cleanText = message.content
        // Remove bold/italic asterisks
        .replace(/\*\*\*/g, '')  // Remove triple asterisks
        .replace(/\*\*/g, '')    // Remove double asterisks (bold)
        .replace(/\*/g, '')      // Remove single asterisks (italic)
        .replace(/__/g, '')      // Remove underscores (bold)
        .replace(/_/g, '')       // Remove single underscores (italic)
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, 'code block')
        .replace(/`([^`]+)`/g, '$1')
        // Remove links but keep text
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        // Remove headers
        .replace(/#{1,6}\s/g, '')
        // Clean up extra spaces
        .replace(/\s+/g, ' ')
        .trim();
      
      // Detect if text contains Tamil characters
      const hasTamil = /[\u0B80-\u0BFF]/.test(cleanText);
      
      // Start speaking
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      let selectedVoice;
      
      if (hasTamil) {
        // Try to find Tamil voice
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('ta') || 
          voice.lang.includes('Tamil') ||
          voice.name.toLowerCase().includes('tamil')
        );
      }
      
      // If no Tamil voice or not Tamil text, use female English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          (voice.name.toLowerCase().includes('female') || 
           voice.name.toLowerCase().includes('woman') ||
           voice.name.toLowerCase().includes('zira') ||
           voice.name.toLowerCase().includes('samantha') ||
           voice.name.toLowerCase().includes('victoria') ||
           voice.name.toLowerCase().includes('karen') ||
           voice.name.toLowerCase().includes('moira') ||
           voice.name.toLowerCase().includes('google uk english female') ||
           voice.name.toLowerCase().includes('microsoft zira')) &&
          voice.lang.startsWith('en')
        ) || voices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Female'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 0.95; // Natural speaking speed
      utterance.pitch = hasTamil ? 1.0 : 1.1; // Normal pitch for Tamil, slightly higher for English
      utterance.volume = 1;
      utterance.lang = hasTamil ? 'ta-IN' : 'en-US';
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Load voices when component mounts
  React.useEffect(() => {
    // Voices need to be loaded
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices();
      });
    }
  }, []);

  return (
    <div className={`flex w-full mb-6 md:mb-8 group ${isLeonux ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex gap-3 md:gap-4 max-w-full md:max-w-3xl ${isLeonux ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden ${
          isLeonux 
            ? 'bg-white border-2 border-emerald-400' 
            : 'bg-white border-2 border-violet-400'
        }`}>
          {isLeonux ? (
            <>
              <div className="absolute inset-0 rounded-full bg-emerald-400 blur-md opacity-40 animate-pulse"></div>
              <img 
                src={`${baseUrl}leonux-logo.png`}
                alt="Leonux" 
                className="w-full h-full object-cover rounded-full relative z-10 scale-110"
              />
            </>
          ) : (
            <>
              <div className="absolute inset-0 rounded-full bg-violet-400 blur-md opacity-30"></div>
              <img 
                src="https://i.pinimg.com/736x/c6/87/ac/c687ac9c599804110a216097e2bad94f.jpg" 
                alt="User" 
                className="w-full h-full object-cover rounded-full relative z-10"
              />
            </>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Name Label */}
          <div className={`text-xs font-semibold mb-1.5 ${isLeonux ? 'text-emerald-400' : 'text-violet-400'}`}>
            {isLeonux ? 'Leonux AI' : 'You'}
          </div>
          
          {/* Message Bubble */}
          <div className={`relative rounded-2xl px-4 py-3 md:px-5 md:py-3.5 shadow-lg transition-all duration-200 ${
            isLeonux 
              ? 'bg-[#2a2a2a] border border-emerald-500/20 hover:border-emerald-500/40' 
              : 'bg-gradient-to-br from-violet-600 to-purple-700 border border-violet-400/30'
          }`}>
            {/* Corner accent */}
            <div className={`absolute ${isLeonux ? 'left-0 top-0' : 'right-0 top-0'} w-1 h-8 ${
              isLeonux ? 'bg-gradient-to-b from-emerald-400 to-transparent rounded-l-2xl' : 'bg-gradient-to-b from-violet-300 to-transparent rounded-r-2xl'
            }`}></div>
            
            <div className={`text-sm md:text-[15px] leading-6 md:leading-7 break-words select-text markdown-content ${
              isLeonux ? 'text-gray-100' : 'text-white'
            }`} style={{ userSelect: 'text', WebkitUserSelect: 'text' }}>
              {/* Check if message contains phone numbers */}
              {/\d{10}/.test(message.content) ? (
                <div className="space-y-2">
                  {formatMessageWithCallButtons(message.content)}
                </div>
              ) : (
                <>
                  {message.content.includes('<table') ? (
                    <div className="overflow-x-auto my-4">
                      <div dangerouslySetInnerHTML={{ __html: message.content }} className="[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:bg-transparent [&_thead]:bg-transparent [&_tbody]:bg-transparent [&_tr]:border-b [&_tr]:border-gray-600 [&_th]:px-6 [&_th]:py-4 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-300 [&_th]:bg-transparent [&_th]:border-b-2 [&_th]:border-gray-500 [&_td]:px-6 [&_td]:py-4 [&_td]:text-gray-300 [&_td]:bg-transparent" />
                    </div>
                  ) : (
                    <ReactMarkdown
                      components={{
                        // Custom styling for markdown elements
                        strong: ({node, ...props}) => <span className="font-bold text-white" {...props} />,
                        em: ({node, ...props}) => <span className="italic" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        html: ({value}: any) => {
                          // Parse and render HTML tables
                          if (value.includes('<table')) {
                            return (
                              <div className="overflow-x-auto my-4">
                                <div dangerouslySetInnerHTML={{ __html: value }} className="[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:bg-transparent [&_thead]:bg-transparent [&_tbody]:bg-transparent [&_tr]:border-b [&_tr]:border-gray-600 [&_th]:px-6 [&_th]:py-4 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-300 [&_th]:bg-transparent [&_th]:border-b-2 [&_th]:border-gray-500 [&_td]:px-6 [&_td]:py-4 [&_td]:text-gray-300 [&_td]:bg-transparent" />
                              </div>
                            );
                          }
                          return <div dangerouslySetInnerHTML={{ __html: value }} />;
                        },
                        table: ({node, ...props}: any) => (
                          <div className="overflow-x-auto my-4">
                            <table className="w-full border-collapse text-sm bg-transparent" {...props} />
                          </div>
                        ),
                        thead: ({node, ...props}: any) => (
                          <thead className="bg-transparent" {...props} />
                        ),
                        tbody: ({node, ...props}: any) => (
                          <tbody className="bg-transparent" {...props} />
                        ),
                        tr: ({node, ...props}: any) => (
                          <tr className="border-b border-gray-600" {...props} />
                        ),
                        th: ({node, ...props}: any) => (
                          <th className="px-6 py-4 text-left font-semibold text-gray-300 bg-transparent border-b-2 border-gray-500" {...props} />
                        ),
                        td: ({node, ...props}: any) => (
                          <td className="px-6 py-4 text-gray-300 bg-transparent" {...props} />
                        ),
                        code: ({node, inline, ...props}: any) => 
                          inline ? (
                            <code className="bg-black/30 px-1.5 py-0.5 rounded text-emerald-300" {...props} />
                          ) : (
                            <code className="block bg-black/30 p-3 rounded-lg my-2 overflow-x-auto text-sm whitespace-pre-wrap break-words max-w-full" {...props} />
                          ),
                        pre: ({node, ...props}: any) => (
                          <pre className="bg-[#1a1a1a] border border-emerald-500/20 rounded-lg p-3 my-2 overflow-x-auto max-w-full" {...props} />
                        ),
                        a: ({node, ...props}) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </>
              )}
              {message.isStreaming && (
                <span className="inline-flex items-center ml-2 gap-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
                </span>
              )}
            </div>

            {/* Copy and Speech Buttons Below Answer - Only for Leonux messages */}
            {isLeonux && !message.isStreaming && (
              <div className="mt-3 flex justify-start gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(message.content);
                    const btn = e.currentTarget;
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                    setTimeout(() => {
                      btn.innerHTML = originalHTML;
                    }, 2000);
                  }}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs transition-all"
                >
                  <i className="fa-solid fa-copy"></i> Copy
                </button>
                <button
                  onClick={handleSpeak}
                  className={`${
                    isSpeaking 
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                      : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                  } px-3 py-1.5 rounded-lg text-xs transition-all`}
                >
                  <i className={`fa-solid ${isSpeaking ? 'fa-stop' : 'fa-volume-high'}`}></i> {isSpeaking ? 'Stop' : 'Speak'}
                </button>
              </div>
            )}

            {message.parts?.map((part, idx) => (
              <div key={idx} className="mt-3 md:mt-4 rounded-xl overflow-hidden border border-white/10 shadow-xl">
                {part.image && (
                  <div className="relative group/img">
                    <img src={part.image} alt="Generated" className="w-full h-auto" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <button 
                        onClick={() => window.open(part.image, '_blank')} 
                        className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs text-white transition-all font-medium"
                      >
                        <i className="fa-solid fa-expand mr-1.5"></i> View Full
                      </button>
                    </div>
                  </div>
                )}
                {part.code && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-emerald-500/30 shadow-xl">
                    {/* Preview toolbar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-emerald-500/20">
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <i className="fa-solid fa-code"></i>
                        <span>Live Preview</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowPreview(p => !p)}
                          className="text-xs px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all"
                        >
                          {showPreview ? 'Show Code' : 'Show Preview'}
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([part.code!], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                          }}
                          className="text-xs px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i>Open
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([part.code!], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'leonux-generated.html';
                            a.click();
                          }}
                          className="text-xs px-3 py-1 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-all"
                        >
                          <i className="fa-solid fa-download mr-1"></i>Download
                        </button>
                      </div>
                    </div>
                    {showPreview ? (
                      <iframe
                        srcDoc={part.code}
                        className="w-full border-0 bg-white"
                        style={{ height: '480px' }}
                        sandbox="allow-scripts allow-same-origin"
                        title="Live Preview"
                      />
                    ) : (
                      <pre className="bg-[#111] text-emerald-300 text-xs p-4 overflow-auto max-h-96 whitespace-pre-wrap break-words">
                        {part.code}
                      </pre>
                    )}
                  </div>
                )}
                {part.video && (
                  <div className="aspect-video bg-black">
                    <video 
                      src={part.video} 
                      controls 
                      className="w-full h-full"
                    />
                  </div>
                )}
                {part.map && (
                  <div className="bg-gray-900">
                    <iframe
                      src={part.map.embedUrl}
                      className="w-full h-64 md:h-80 border-0"
                      title={part.map.name}
                      loading="lazy"
                    />
                    <div className="p-3 bg-gray-800/50 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400 mb-1">Location</div>
                        <div className="text-sm text-white truncate">{part.map.name}</div>
                      </div>
                      <a
                        href={part.map.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-all flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-map-location-dot"></i>
                        Open Map
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Timestamp */}
          <div className={`text-[10px] text-gray-600 mt-1.5 ${isLeonux ? 'text-left' : 'text-right'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
});
