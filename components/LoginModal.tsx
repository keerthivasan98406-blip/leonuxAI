import React, { useState, useEffect } from 'react';

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
    // Google OAuth is disabled for now - requires Google Cloud project setup
    // Uncomment when you have a valid client ID
    /*
    if (isOpen && window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleGoogleLogin,
        auto_select: false,
      });
    }
    */
  }, [isOpen]);

  // Play lion roar when modal opens
  useEffect(() => {
    if (isOpen && audioRef.current) {
      // Try to play immediately
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio autoplay blocked, will play on first interaction:', error);
          // Add click listener to play on first interaction
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
  }, [isOpen]);

  const handleGoogleLogin = (response: any) => {
    // This function is for future Google OAuth integration
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      setName(payload.name);
      setEmail(payload.email);
      setMessage('Google account loaded! Click "Get OTP" to continue.');
      setMessageType('success');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch (error) {
      console.error('Google login error:', error);
      setMessage('Failed to load Google account');
      setMessageType('error');
    }
  };

  const handleGoogleButtonClick = () => {
    // Simplified Google login - just prompt for email
    const googleEmail = prompt('Enter your Google email:');
    if (googleEmail && googleEmail.includes('@')) {
      const googleName = prompt('Enter your name:');
      if (googleName) {
        setName(googleName);
        setEmail(googleEmail);
        setMessage('Google account loaded! Click "Get OTP" to continue.');
        setMessageType('success');
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

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setMessage(`Login successful! Welcome, ${name}.`);
      setMessageType('success');
      // Stop the audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
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
      {/* Lion Roar Audio - Make sure the file exists in public folder */}
      <audio
        ref={audioRef}
        src={`${baseUrl}lion-roar.mp3`}
        loop
        preload="auto"
      />
      
      {/* Glow effect */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-radial from-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center z-10 relative">
        {/* Video Illustration - Show on mobile too */}
        <div className="flex justify-center items-center md:hidden">
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

        {/* Login Form */}
        <div className="space-y-4 md:space-y-6 bg-[#1a1a1a]/95 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-emerald-500/20 max-w-sm mx-auto w-full">
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
                Get OTP
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#1a1a1a] text-gray-400">Or</span>
                </div>
              </div>

              {/* Google Sign In - Circular Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={handleGoogleButtonClick}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all flex items-center justify-center group"
                  title="Sign in with Google"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <div id="google-signin-button" className="hidden"></div>
              </div>
              <p className="text-xs text-center text-gray-400">Sign in with Google</p>
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

        {/* Video Illustration - Desktop */}
        <div className="hidden md:flex justify-center items-center md:col-start-2 md:row-start-1">
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
      </div>
    </div>
  );
};
