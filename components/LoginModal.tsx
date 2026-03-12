import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/databaseService';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (name: string, email: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLoginSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const baseUrl = import.meta.env.BASE_URL || '/';

  useEffect(() => {
    // Load Google OAuth
    if (isOpen && window.google) {
      window.google.accounts.id.initialize({
        client_id: '668572083647-brs9bobppbein5a0i12aahdji1a5dorc.apps.googleusercontent.com',
        callback: handleGoogleLogin,
        auto_select: false,
      });
      
      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { 
          theme: 'outline', 
          size: 'large',
          width: 250,
          text: 'signin_with'
        }
      );
    }
  }, [isOpen]);

  // Play lion roar when modal opens
  useEffect(() => {
    // Audio removed - file not available
    /*
    if (isOpen && audioRef.current) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio autoplay blocked, will play on first interaction:', error);
          const playOnInteraction = () => {
            if (audioRef.current) {
              audioRef.current.play();
              document.removeEventListener('click', playOnInteraction);
            }
          };
          document.addEventListener('click', playOnInteraction);
        });
      }
    } else if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
    */
  }, [isOpen]);

  const handleGoogleLogin = async (response: any) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const googleName = payload.name;
      const googleEmail = payload.email;
      
      // Stop the audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Save user to database
      try {
        await loginUser(googleName, googleEmail);
        console.log('✅ User saved to database');
      } catch (error) {
        console.error('Failed to save user to database:', error);
      }
      
      // Directly login without OTP
      onLoginSuccess(googleName, googleEmail);
    } catch (error) {
      console.error('Google login error:', error);
      setMessage('Failed to sign in with Google');
      setMessageType('error');
    }
  };

  const handleGoogleButtonClick = async () => {
    // Fallback for manual Google login
    const googleEmail = prompt('Enter your Google email:');
    if (googleEmail && googleEmail.includes('@')) {
      const googleName = prompt('Enter your name:');
      if (googleName) {
        // Save user to database
        try {
          await loginUser(googleName, googleEmail);
          console.log('✅ User saved to database');
        } catch (error) {
          console.error('Failed to save user to database:', error);
        }
        
        // Directly login without OTP
        onLoginSuccess(googleName, googleEmail);
      }
    }
  };

  if (!isOpen) return null;

  const sendOtp = () => {
    if (!name.trim()) {
      setMessage('Please enter your name');
      setMessageType('error');
      return;
    }
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setStep('otp');
    setMessage('');
  };

  const verifyOtp = async () => {
    if (otp === generatedOtp) {
      setMessage(`Login successful! Welcome, ${name}.`);
      setMessageType('success');
      // Stop the audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Save user to database
      try {
        await loginUser(name, email);
        console.log('✅ User saved to database');
      } catch (error) {
        console.error('Failed to save user to database:', error);
        // Continue with login even if database save fails
      }
      
      setTimeout(() => {
        onLoginSuccess(name, email);
      }, 1000);
    } else {
      setMessage('Invalid OTP. Please try again.');
      setMessageType('error');
    }
  };

  const resetFlow = () => {
    setStep('email');
    setMessage('');
    setOtp('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Lion Roar Audio - Disabled (file not available) */}
      {/*
      <audio
        ref={audioRef}
        src={`${baseUrl}lion-roar.mp3`}
        loop
        preload="auto"
      />
      */}
      
      {/* Glow effect */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-radial from-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center z-10 relative">
        {/* Video Illustration - Left side on desktop */}
        <div className="hidden md:flex justify-center items-center order-1">
          <div className="relative w-full aspect-square max-w-[350px] lg:max-w-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full overflow-hidden border-4 md:border-8 border-[#0a0c0a] shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-85"
              >
                <source
                  src={`${baseUrl}login-video.mp4`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
            </div>
          </div>
        </div>

        {/* Video Illustration - Mobile (top) */}
        <div className="flex justify-center items-center md:hidden order-1">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full overflow-hidden border-4 border-[#0a0c0a] shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-85"
              >
                <source
                  src={`${baseUrl}login-video.mp4`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
            </div>
          </div>
        </div>

        {/* Login Form - Right side */}
        <div className="space-y-4 md:space-y-6 bg-[#1a1a1a]/95 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-emerald-500/20 max-w-sm mx-auto w-full order-2">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">WELCOME!</h1>
            <p className="text-xs text-gray-400">Continue using Leonux AI</p>
          </div>

          {/* Step 1: Name & Email */}
          {step === 'email' && (
            <div className="space-y-3 md:space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs md:text-sm font-medium text-white ml-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 md:px-5 py-2 md:py-2.5 text-sm bg-transparent border-2 border-emerald-500/60 rounded-full focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-gray-600"
                  onKeyPress={(e) => e.key === 'Enter' && sendOtp()}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs md:text-sm font-medium text-white ml-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 md:px-5 py-2 md:py-2.5 text-sm bg-transparent border-2 border-emerald-500/60 rounded-full focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-gray-600"
                  onKeyPress={(e) => e.key === 'Enter' && sendOtp()}
                />
              </div>

              <button
                onClick={sendOtp}
                className="w-full py-2.5 md:py-3 bg-gradient-to-br from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-700 text-white font-bold text-base md:text-lg rounded-full shadow-lg shadow-emerald-500/30 transition-all"
              >
                Get Authentication
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#1a1a1a] text-gray-400">Or</span>
                </div>
              </div>

              {/* Google Sign In - OAuth Button */}
              <div className="flex flex-col items-center gap-1.5">
                <div id="google-signin-button" className="flex justify-center"></div>
              </div>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="block text-lg font-medium text-white">Enter OTP</label>
                  <button
                    onClick={resetFlow}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Change Details
                  </button>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                  maxLength={4}
                  placeholder="0000"
                  className="w-full px-6 py-3.5 bg-transparent border-2 border-emerald-500/60 rounded-full focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-gray-600 font-bold text-center tracking-[1em]"
                  onKeyPress={(e) => e.key === 'Enter' && verifyOtp()}
                />
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mt-4">
                  <p className="text-xs text-center text-gray-300">
                    Your OTP is <span className="text-emerald-400 font-bold text-sm">{generatedOtp}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={verifyOtp}
                className="w-full py-4 bg-gradient-to-br from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-700 text-white font-bold text-xl rounded-full shadow-lg shadow-emerald-500/30 transition-all"
              >
                Verify & Sign In
              </button>
            </div>
          )}

          {message && (
            <p className={`text-sm text-center font-medium ${messageType === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
