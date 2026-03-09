
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatContainer } from './components/ChatContainer';
import { LoginModal } from './components/LoginModal';
import { Message, MessageRole, AppState, ChatHistoryItem, ChatSession } from './types';
import { chatWithLeonux, generateImageWithLeonux, generateVideoWithLeonux } from './services/geminiService';
import { detectLocationQuery, getLocationInfo } from './services/mapService';
import { isAuthenticated, saveAuth, getAuth } from './services/authService';

// Use the existing global AIStudio type to avoid declaration conflicts
declare global {
  interface Window {
    aistudio?: any;
  }
}

const App: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  
  // Load chat sessions from localStorage
  const loadChatSessions = (): ChatSession[] => {
    try {
      const saved = localStorage.getItem('leonux_chat_sessions');
      if (saved) {
        const sessions = JSON.parse(saved);
        // Auto-delete chats older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const filtered = sessions
          .map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt),
            messages: s.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }))
          }))
          .filter((s: ChatSession) => new Date(s.updatedAt) >= thirtyDaysAgo);
        
        // Save filtered sessions back
        if (filtered.length !== sessions.length) {
          localStorage.setItem('leonux_chat_sessions', JSON.stringify(filtered));
        }
        
        return filtered;
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
    return [];
  };

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(loadChatSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Check authentication on mount
  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsUserAuthenticated(authenticated);
    // Show login modal if not authenticated
    if (!authenticated) {
      setShowLoginModal(true);
    }
  }, []);
  
  const getWelcomeMessage = (): Message => ({
    id: 'welcome',
    role: MessageRole.LEONUX,
    content: "Leonux Hub Online. Imaging and Motion engines ready. How shall we proceed?",
    timestamp: new Date()
  });

  const [state, setState] = useState<AppState>({
    messages: [getWelcomeMessage()],
    history: [],
    isLoading: false,
    currentInput: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Save current session whenever messages change
  useEffect(() => {
    if (state.messages.length > 1) { // More than just welcome message
      const generateTitle = () => {
        const firstUserMessage = state.messages.find(m => m.role === MessageRole.USER);
        if (firstUserMessage) {
          return firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
        }
        return 'New Chat';
      };

      const now = new Date();
      
      if (currentSessionId) {
        // Update existing session
        setChatSessions(prev => {
          const updated = prev.map(session => 
            session.id === currentSessionId
              ? {
                  ...session,
                  messages: state.messages,
                  history: state.history,
                  updatedAt: now
                }
              : session
          );
          localStorage.setItem('leonux_chat_sessions', JSON.stringify(updated));
          return updated;
        });
      } else {
        // Create new session
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: generateTitle(),
          messages: state.messages,
          history: state.history,
          createdAt: now,
          updatedAt: now
        };
        setCurrentSessionId(newSession.id);
        setChatSessions(prev => {
          const updated = [newSession, ...prev];
          localStorage.setItem('leonux_chat_sessions', JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [state.messages, state.history, currentSessionId]);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setState({
      messages: [getWelcomeMessage()],
      history: [],
      isLoading: false,
      currentInput: ''
    });
  };

  const handleLoginSuccess = (name: string, email: string) => {
    saveAuth(name, email);
    setIsUserAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsUserAuthenticated(false);
    setShowLoginModal(true);
    // Clear current session
    handleNewChat();
  };

  const handleLoadChat = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setState({
        messages: session.messages,
        history: session.history,
        isLoading: false,
        currentInput: ''
      });
    }
  };

  const handleDeleteChat = (sessionId: string) => {
    setChatSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      localStorage.setItem('leonux_chat_sessions', JSON.stringify(updated));
      return updated;
    });
    
    // If deleting current session, start a new chat
    if (currentSessionId === sessionId) {
      handleNewChat();
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSend = async (input: string, imageBase64?: string, fileContent?: string) => {
    if (!input.trim() || state.isLoading) return;

    // Combine user input with file content if available
    const fullPrompt = fileContent 
      ? `${input}\n\n[Attached Document Content]:\n${fileContent}`
      : input;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: input,
      timestamp: new Date(),
      parts: imageBase64 ? [{ image: imageBase64 }] : undefined
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    const isVideoRequest = /\b(video|movie|clip|animation|motion|film)\b/i.test(input) && 
                           /\b(create|generate|make|render|draw|imagine)\b/i.test(input);
    
    // Check for location query
    const locationQuery = detectLocationQuery(input);
    
    // More flexible image detection - but not if user uploaded an image or document
    const isImageRequest = !imageBase64 && !fileContent && !isVideoRequest && !locationQuery && (
      /\b(image|picture|photo|portrait|artwork|illustration|drawing|painting)\b/i.test(input) ||
      /^(draw|paint|sketch)\b/i.test(input.toLowerCase())
    );

    console.log('Input:', input);
    console.log('Is Image Request:', isImageRequest);
    console.log('Has uploaded image:', !!imageBase64);
    console.log('Has file content:', !!fileContent);
    console.log('Location query:', locationQuery);

    try {
      if (locationQuery) {
        // Handle location/map request
        const leonuxPlaceholder: Message = {
          id: (Date.now() + 1).toString(),
          role: MessageRole.LEONUX,
          content: `Searching for ${locationQuery}...`,
          timestamp: new Date(),
          isStreaming: true
        };
        
        setState(prev => ({ ...prev, messages: [...prev.messages, leonuxPlaceholder] }));

        const locationInfo = await getLocationInfo(locationQuery);
        
        if (locationInfo) {
          // Get AI to provide information about the location
          const leonuxMessageId = (Date.now() + 2).toString();
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(m => 
              m.id === leonuxPlaceholder.id 
                ? { ...m, content: '', isStreaming: true, id: leonuxMessageId }
                : m
            )
          }));

          const locationPrompt = `Tell me about ${locationQuery}. Provide a brief interesting story or historical fact about this place in 2-3 sentences.`;
          
          const finalResponseText = await chatWithLeonux(locationPrompt, state.history, (fullText) => {
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(m => m.id === leonuxMessageId ? { ...m, content: fullText } : m)
            }));
          });

          setState(prev => ({
            ...prev,
            messages: prev.messages.map(m => 
              m.id === leonuxMessageId 
                ? { 
                    ...m, 
                    isStreaming: false,
                    parts: [{
                      map: {
                        name: locationInfo.name,
                        embedUrl: locationInfo.embedUrl,
                        mapUrl: locationInfo.mapUrl
                      }
                    }]
                  }
                : m
            ),
            isLoading: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(m => 
              m.id === leonuxPlaceholder.id 
                ? { ...m, content: `I couldn't find the location "${locationQuery}". Please try with a more specific place name.`, isStreaming: false }
                : m
            ),
            isLoading: false
          }));
        }
      } else if (isVideoRequest) {
        // Video generation temporarily disabled
        const leonuxPlaceholder: Message = {
          id: (Date.now() + 1).toString(),
          role: MessageRole.LEONUX,
          content: "Video generation is temporarily unavailable due to API limitations. Please try text or image requests instead.",
          timestamp: new Date(),
          isStreaming: false
        };
        
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, leonuxPlaceholder],
          isLoading: false
        }));

      } else if (isImageRequest) {
        const leonuxPlaceholder: Message = {
          id: (Date.now() + 1).toString(),
          role: MessageRole.LEONUX,
          content: "Generating visual asset...",
          timestamp: new Date(),
          isStreaming: true
        };
        
        setState(prev => ({ ...prev, messages: [...prev.messages, leonuxPlaceholder] }));

        const imageUrl = await generateImageWithLeonux(input);
        console.log('Generated image URL:', imageUrl);
        
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(m => 
            m.id === leonuxPlaceholder.id 
              ? imageUrl 
                ? { ...m, content: "Image generated:", parts: [{ image: imageUrl }], isStreaming: false }
                : { ...m, content: "Image generation failed. Please try again.", isStreaming: false }
              : m
          ),
          isLoading: false
        }));
      } else {
        const leonuxMessageId = (Date.now() + 1).toString();
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, { id: leonuxMessageId, role: MessageRole.LEONUX, content: '', timestamp: new Date(), isStreaming: true }]
        }));

        const finalResponseText = await chatWithLeonux(fullPrompt, state.history, (fullText) => {
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(m => m.id === leonuxMessageId ? { ...m, content: fullText } : m)
          }));
        }, imageBase64);

        const newHistory: ChatHistoryItem[] = [
          ...state.history,
          { role: 'user', parts: [{ text: input }] },
          { role: 'model', parts: [{ text: finalResponseText }] }
        ];

        setState(prev => ({
          ...prev,
          history: newHistory,
          messages: prev.messages.map(m => m.id === leonuxMessageId ? { ...m, isStreaming: false } : m),
          isLoading: false
        }));
      }
    } catch (error) {
      console.error("Leonux System Error:", error);
      
      let errorMessage = "System interruption in Neural Hub. Check connection or project billing for video generation.";
      
      // Handle rate limit errors
      if (error instanceof Error && error.message.includes("429")) {
        errorMessage = "Rate limit exceeded. Please wait a few seconds and try again.";
      } else if (error instanceof Error && error.message.includes("quota")) {
        errorMessage = "API quota exceeded. Please wait a moment or check your API key limits.";
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        messages: [...prev.messages, {
          id: 'error-' + Date.now(),
          role: MessageRole.LEONUX,
          content: errorMessage,
          timestamp: new Date()
        }]
      }));
    }
  };

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a] text-gray-100">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          onNewChat={handleNewChat}
          onLoadChat={handleLoadChat}
          onDeleteChat={handleDeleteChat}
          onLogout={handleLogout}
          chatSessions={chatSessions}
          currentSessionId={currentSessionId}
        />
        
        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Mobile Header - Simple and reliable */}
          <div className="lg:hidden bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-white text-xl p-2"
              aria-label="Open menu"
            >
              ☰
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                L
              </div>
              <span className="text-emerald-400 font-semibold text-sm">Leonux AI</span>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Subtle background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatContainer 
              messages={state.messages} 
              isLoading={state.isLoading}
              onSend={handleSend}
              chatEndRef={chatEndRef}
            />
          </div>
        </main>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default App;
