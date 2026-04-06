import React, { useState } from 'react';
import { getAuth, saveAuth } from '../services/authService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave }) => {
  const userAuth = getAuth();
  const [name, setName] = useState(userAuth?.name || '');
  const [email, setEmail] = useState(userAuth?.email || '');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      setMessage('Please enter your name');
      return;
    }
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email');
      return;
    }

    saveAuth(name, email);
    setMessage('Profile updated successfully!');
    setTimeout(() => {
      onSave();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a]/95 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/20 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white ml-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-6 py-3 bg-transparent border-2 border-emerald-500/60 rounded-full focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white ml-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full px-6 py-3 bg-transparent border-2 border-emerald-500/60 rounded-full focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-gray-600"
            />
          </div>

          {message && (
            <p className={`text-sm text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-br from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
