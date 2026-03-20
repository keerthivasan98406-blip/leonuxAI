
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Message, MessageRole } from '../types';
import { MessageItem } from './MessageItem';
import { processFile, ProcessedFile } from '../services/fileProcessingService';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (text: string, imageBase64?: string, fileContent?: string, codeMode?: boolean) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, onSend, chatEndRef }) => {
  const [inputValue, setInputValue] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<ProcessedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isProcessing) {
      const imageData = uploadedFile?.requiresVision ? uploadedFile.content : uploadedImage;
      const textData = uploadedFile && !uploadedFile.requiresVision ? uploadedFile.content : undefined;
      onSend(inputValue, imageData || undefined, textData, isCodeMode);
      setInputValue('');
      setUploadedImage(null);
      setUploadedFile(null);
    }
  };

  const processDroppedFile = async (file: File) => {
    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      alert(`File is too large. Maximum size is 20MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
      return;
    }

    setIsProcessing(true);
    
    try {
      const processed = await processFile(file);
      setUploadedFile(processed);
      
      if (processed.type === 'image') {
        setUploadedImage(processed.content);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processDroppedFile(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      // Check if it's a supported file type
      const supportedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      
      if (supportedTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|gif|webp|pdf|ppt|pptx)$/i)) {
        await processDroppedFile(file);
      } else {
        alert('Unsupported file type. Please upload images, PDFs, or PowerPoint files.');
      }
    }
  };

  const removeFile = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Speech recognition — converts voice to text in the input box
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;      // stop after a natural pause
    recognition.interimResults = false;  // only return final confirmed text
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => (prev ? prev + ' ' : '') + transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in your browser settings.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // recognition already running
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  // Memoize message list to prevent unnecessary re-renders
  const messageList = useMemo(() => 
    messages.map((msg) => <MessageItem key={msg.id} message={msg} />),
    [messages]
  );

  return (
    <div 
      ref={dropZoneRef}
      className="flex-1 flex flex-col h-full overflow-hidden relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag and Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1a1a1a]/95 border-2 border-emerald-500 border-dashed rounded-3xl p-12 text-center">
            <i className="fa-solid fa-cloud-arrow-up text-6xl text-emerald-400 mb-4"></i>
            <p className="text-2xl text-white font-medium mb-2">Drop your file here</p>
            <p className="text-gray-400">Images, PDFs, and PowerPoint files supported</p>
          </div>
        </div>
      )}
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/736x/7a/98/7c/7a987c82ec870c0a4324fc357db66ea2.jpg)'
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#212121]/70 to-[#1a1a1a]/80"></div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-3xl mx-auto w-full px-4 py-8 lg:py-8">
          {/* Mobile header spacer - INCREASED */}
          <div className="lg:hidden h-8"></div>
          {messageList}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-emerald-500/10 bg-[#1a1a1a]/90 backdrop-blur-xl relative z-10">
        <div className="max-w-3xl mx-auto w-full px-4 py-4 md:py-6">
          <form 
            onSubmit={handleSubmit}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
            
            {/* File Preview */}
            {uploadedFile && (
              <div className="mb-3 relative inline-block max-w-full">
                {uploadedFile.requiresVision ? (
                  <div className="relative">
                    {uploadedFile.type === 'image' ? (
                      <img src={uploadedFile.content} alt="Upload preview" className="max-h-32 rounded-lg border border-emerald-500/30" />
                    ) : (
                      <div className="px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center gap-3">
                        <i className="fa-solid fa-file-powerpoint text-2xl text-purple-400"></i>
                        <div className="flex-1">
                          <div className="text-sm text-white font-medium">{uploadedFile.fileName}</div>
                          <div className="text-xs text-gray-400">PowerPoint - Will be analyzed visually</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                    <i className="fa-solid fa-file-pdf text-2xl text-emerald-400"></i>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{uploadedFile.fileName}</div>
                      <div className="text-xs text-gray-400">PDF text extracted</div>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs shadow-lg z-10"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            )}
            
            {isProcessing && (
              <div className="mb-3 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-blue-400">Processing file...</span>
              </div>
            )}
            
            <div className="relative flex items-end gap-2 bg-[#2a2a2a]/95 backdrop-blur-sm rounded-3xl px-3 md:px-4 py-2.5 md:py-3 shadow-2xl border border-emerald-500/20 group-focus-within:border-emerald-500/40 transition-all">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex-shrink-0 p-2 text-gray-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-500/10 disabled:opacity-50"
                title="Upload image, PDF, or PowerPoint"
              >
                <i className="fa-solid fa-paperclip text-base md:text-lg"></i>
              </button>
              
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isCodeMode ? "Describe a website to build..." : "Type your message..."}
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm md:text-[15px] text-white placeholder:text-gray-600 leading-6 max-h-[200px] min-w-0"
                rows={1}
              />

              <button 
                type="button"
                onClick={toggleVoiceInput}
                disabled={isProcessing || isLoading}
                className={`flex-shrink-0 p-2 transition-all rounded-lg disabled:opacity-50 ${
                  isListening 
                    ? 'text-red-400 bg-red-500/20 animate-pulse' 
                    : 'text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                }`}
                title={isListening ? "Stop recording" : "Voice input"}
              >
                <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'} text-base md:text-lg`}></i>
              </button>

              <button
                type="button"
                onClick={() => setIsCodeMode(m => !m)}
                className={`flex-shrink-0 p-2 transition-all rounded-lg text-xs font-bold ${
                  isCodeMode
                    ? 'text-violet-300 bg-violet-500/20 border border-violet-500/40'
                    : 'text-gray-500 hover:text-violet-400 hover:bg-violet-500/10'
                }`}
                title="Code mode — describe a website and AI builds it"
              >
                <i className="fa-solid fa-code text-base md:text-lg"></i>
              </button>

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  inputValue.trim() && !isLoading 
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95' 
                    : 'bg-[#3a3a3a] text-gray-600'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-emerald-400 rounded-full animate-spin"></div>
                ) : (
                  <i className="fa-solid fa-arrow-up text-sm"></i>
                )}
              </button>
            </div>
          </form>
          
          <p className="text-center text-xs text-gray-600 mt-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            Leonux AI may misinterpret certain queries •
          </p>
        </div>
      </div>
    </div>
  );
};
