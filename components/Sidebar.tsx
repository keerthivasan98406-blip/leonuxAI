import React, { useState } from 'react';
import { ChatSession } from '../types';
import { getAuth, clearAuth } from '../services/authService';
import { EditProfileModal } from './EditProfileModal';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNewChat: () => void;
  onLoadChat: (sessionId: string) => void;
  onDeleteChat: (sessionId: string) => void;
  onLogout: () => void;
  chatSessions: ChatSession[];
  currentSessionId: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  onNewChat, 
  onLoadChat,
  onDeleteChat,
  onLogout,
  chatSessions,
  currentSessionId 
}) => {
  const [userAuth, setUserAuth] = useState(getAuth());
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileUpdate = () => {
    setUserAuth(getAuth());
  };

  const handleLogout = () => {
    clearAuth();
    setShowProfileMenu(false);
    onLogout();
  };
  // Group chats by date
  const groupChatsByDate = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);

    const groups: { [key: string]: ChatSession[] } = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Previous 30 Days': []
    };

    chatSessions.forEach(session => {
      const sessionDate = new Date(session.updatedAt);
      if (sessionDate >= today) {
        groups['Today'].push(session);
      } else if (sessionDate >= yesterday) {
        groups['Yesterday'].push(session);
      } else if (sessionDate >= lastWeek) {
        groups['Previous 7 Days'].push(session);
      } else if (sessionDate >= lastMonth) {
        groups['Previous 30 Days'].push(session);
      }
    });

    return groups;
  };

  const groupedChats = groupChatsByDate();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 flex-shrink-0 bg-[#171717] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex-1 overflow-y-auto p-2 pt-20 lg:pt-2">
          {/* New Chat Button */}
          <button 
            onClick={() => {
              onNewChat();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 mb-2 text-sm text-white hover:bg-[#212121] rounded-lg transition-colors"
          >
            <i className="fa-solid fa-plus text-base"></i>
            <span>New chat</span>
          </button>

          {/* Chat History */}
          <div className="mt-4">
            {Object.entries(groupedChats).map(([groupName, sessions]) => (
              sessions.length > 0 && (
                <div key={groupName} className="mb-4">
                  <h3 className="px-3 py-2 text-xs text-gray-500 font-medium">{groupName}</h3>
                  <div className="space-y-1">
                    {sessions.map(session => (
                      <div
                        key={session.id}
                        className={`relative group w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between ${
                          currentSessionId === session.id 
                            ? 'bg-[#212121] text-white' 
                            : 'text-gray-300 hover:bg-[#212121]'
                        }`}
                      >
                        <button
                          onClick={() => {
                            onLoadChat(session.id);
                            setIsOpen(false);
                          }}
                          className="truncate flex-1 text-left"
                        >
                          {session.title}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(session.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-red-500/20 rounded flex-shrink-0"
                          title="Delete chat"
                        >
                          <i className="fa-solid fa-trash text-xs text-red-400"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex-shrink-0 p-2 border-t border-white/10">
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-[#212121] rounded-lg transition-colors mb-1 group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                {userAuth?.name ? userAuth.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm truncate">{userAuth?.name || 'User'}</div>
                <div className="text-xs text-gray-500 truncate">{userAuth?.email || ''}</div>
              </div>
              <i className={`fa-solid fa-chevron-${showProfileMenu ? 'up' : 'down'} text-xs text-gray-400`}></i>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#2a2a2a] border border-emerald-500/20 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setShowEditProfile(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#212121] transition-colors"
                >
                  <i className="fa-solid fa-user-pen text-emerald-400"></i>
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#212121] transition-colors border-t border-white/10"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Help and Upgrade Buttons */}
          <button 
            onClick={() => setShowUpgradeModal(true)}
            className="w-full px-3 py-2.5 text-sm text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium"
          >
            Upgrade
          </button>
        </div>
      </aside>
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleProfileUpdate}
      />
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a]/95 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/20 max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
              <i className="fa-solid fa-rocket text-3xl text-white"></i>
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
              Upgrade Coming Soon!
            </h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              We're working on exciting premium features for Leonux AI. Stay tuned for advanced capabilities, priority support, and more!
            </p>
            
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <i className="fa-solid fa-check text-emerald-400"></i>
                <span>Unlimited conversations</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <i className="fa-solid fa-check text-emerald-400"></i>
                <span>Priority response times</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <i className="fa-solid fa-check text-emerald-400"></i>
                <span>Advanced AI models</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <i className="fa-solid fa-check text-emerald-400"></i>
                <span>Exclusive features</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-full py-3 bg-gradient-to-br from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};