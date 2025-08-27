/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Send, Phone, Users, Car, Building, Search, Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import adminServiceInstance from '../../../Services/Dispatch/DriverManagement';
import clientService from '../../../Services/Dispatch/ClientService';
import memberService from '../../../Services/Dispatch/MemberService';
import { sendMessage, getSentMessages, getInboxMessages } from '../../../Services/Dispatch/messageService';

const baseFileUrl = `${import.meta.env.VITE_API_URL}/uploads`;

// Generate avatar with initials
const generateAvatar = (firstName, lastName, name) => {
  const colors = [
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-green-500 to-emerald-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
    'bg-gradient-to-br from-red-500 to-pink-500',
    'bg-gradient-to-br from-indigo-500 to-purple-500',
    'bg-gradient-to-br from-teal-500 to-blue-500',
    'bg-gradient-to-br from-rose-500 to-red-500'
  ];
  
  let initials = '';
  if (name) {
    const nameParts = name.split(' ');
    initials = `${nameParts[0]?.[0] || ''}${nameParts[1]?.[0] || nameParts[0]?.[1] || ''}`.toUpperCase();
  } else {
    initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  }
  
  const colorIndex = (firstName?.charCodeAt(0) || name?.charCodeAt(0) || 0) % colors.length;
  
  return {
    initials,
    colorClass: colors[colorIndex]
  };
};

// Avatar component
// eslint-disable-next-line react/prop-types
const Avatar = ({ entity, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  // eslint-disable-next-line react/prop-types
  if (entity.profileImage) {
    return (
      <img
        // eslint-disable-next-line react/prop-types
        src={entity.profileImage}
        alt="Profile"
        className={`${sizeClasses[size]} object-cover rounded-full border-2 border-white shadow-lg`}
      />
    );
  }

  // eslint-disable-next-line react/prop-types
  if (entity.nationalIdOrPassport) {
    return (
      <img
        // eslint-disable-next-line react/prop-types
        src={`${baseFileUrl}/${entity.nationalIdOrPassport}`}
        alt="Profile"
        className={`${sizeClasses[size]} object-cover rounded-full border-2 border-white shadow-lg`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  // eslint-disable-next-line react/prop-types
  const avatar = generateAvatar(entity.firstName, entity.lastName, entity.name);
  
  return (
    <div className={`${sizeClasses[size]} ${avatar.colorClass} rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white`}>
      {avatar.initials}
    </div>
  );
};

// Tab component
// eslint-disable-next-line react/prop-types
const Tab = ({ label, active, onClick, icon: Icon }) => (
  <button
    className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-300 relative min-w-0 ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105' 
        : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-800'
    } first:rounded-tl-xl last:rounded-tr-xl border-b-3 ${active ? 'border-transparent' : 'border-gray-100'}`}
    onClick={onClick}
  >
    <Icon size={18} className={active ? 'text-white' : 'text-gray-500'} />
    <span className="hidden sm:inline truncate">{label}</span>
    {active && (
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
    )}
  </button>
);

// Loading component
// eslint-disable-next-line react/prop-types
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
    <p className="text-gray-500 font-medium">{message}</p>
  </div>
);

// Message bubble component
// eslint-disable-next-line react/prop-types
const MessageBubble = ({ entry, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
      isOwn 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
        : 'bg-white border border-gray-200 text-gray-800'
    }`}>
      <p className="text-sm">{entry.message}</p>
      <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
);

const ChatTabs = () => {
  const [activeTab, setActiveTab] = useState('Drivers');
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [phoneInput, setPhoneInput] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      try {
        let data = [];
        if (activeTab === 'Drivers') data = await adminServiceInstance.getDrivers();
        if (activeTab === 'Members') data = await memberService.getAllMembers();
        if (activeTab === 'Clients') data = await clientService.getAllClients();
        setEntities(data);
      } catch (error) {
        console.error(`Error fetching ${activeTab.toLowerCase()}:`, error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab !== 'Phone') {
      fetchEntities();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!selectedEntity) return setChatLog([]);

    const fetchChat = async () => {
      setChatLoading(true);
      try {
        const phone = selectedEntity.phoneNumber || selectedEntity.phone;
        const [sentMessages, inboxMessages] = await Promise.all([
          getSentMessages(phone),
          getInboxMessages(phone)
        ]);

        const formattedSent = sentMessages.map((msg) => ({
          id: msg.id,
          sender: 'You',
          message: msg.content,
          timestamp: new Date(msg.createdAt).getTime(),
          isOwn: true
        }));

        const formattedInbox = inboxMessages.map((msg) => ({
          id: msg.id || msg.date || Math.random(),
          sender: msg.from === phone ? selectedEntity.firstName || selectedEntity.name : 'User',
          message: msg.body || msg.content || '',
          timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
          isOwn: false
        }));

        const combined = [...formattedSent, ...formattedInbox].sort((a, b) => a.timestamp - b.timestamp);
        setChatLog(combined);
      } catch (err) {
        console.error('Error loading chat:', err.message);
      } finally {
        setChatLoading(false);
      }
    };

    fetchChat();
  }, [selectedEntity]);

  const handleSend = async () => {
    if (!message.trim() || !selectedEntity || sending) return;
    
    setSending(true);
    try {
      const phone = selectedEntity.phoneNumber || selectedEntity.phone;
      await sendMessage(phone, message);
      const newMessage = { 
        id: Date.now(), 
        sender: 'You', 
        message, 
        timestamp: Date.now(), 
        isOwn: true 
      };
      setChatLog((prev) => [...prev, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleCustomSend = async () => {
    if (!phoneInput || !customMessage.trim() || sending) return;
    
    setSending(true);
    try {
      await sendMessage(phoneInput, customMessage);
      alert('Message sent successfully!');
      setPhoneInput('');
      setCustomMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e, handler) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handler();
    }
  };

  const filteredEntities = entities.filter(entity => {
    const name = entity.name || `${entity.firstName} ${entity.lastName}`;
    const phone = entity.phone || entity.phoneNumber;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           phone.includes(searchTerm);
  });

  const tabs = [
    { key: 'Drivers', label: 'Drivers', icon: Car },
    { key: 'Members', label: 'Members', icon: Users },
    { key: 'Clients', label: 'Clients', icon: Building },
    { key: 'Phone', label: 'Phone', icon: Phone }
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Custom styles for PhoneInput */}
      <style jsx>{`
        .PhoneInput {
          --PhoneInputCountryFlag-height: 1.2em;
          --PhoneInputCountrySelectArrow-color: #6b7280;
        }
        .PhoneInput .PhoneInputInput {
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .PhoneInput .PhoneInputInput:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .PhoneInputCountrySelect {
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          padding: 0.75rem;
          margin-right: 0.5rem;
          background: white;
          transition: all 0.2s;
        }
        .PhoneInputCountrySelect:hover {
          background-color: #f9fafb;
        }
        .PhoneInputCountrySelect:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>

      {/* Header Tabs */}
      <div className="flex bg-white shadow-sm border-b border-gray-200">
        {tabs.map((tab) => (
          <Tab 
            key={tab.key} 
            label={tab.label} 
            active={activeTab === tab.key} 
            onClick={() => {
              setActiveTab(tab.key);
              setSelectedEntity(null);
              setChatLog([]);
              setSearchTerm('');
            }} 
            icon={tab.icon}
          />
        ))}
      </div>

      {activeTab === 'Phone' ? (
        <div className="flex-1 p-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Phone className="text-blue-500" size={28} />
              Send Message to Phone
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <PhoneInput
                  international
                  defaultCountry="RW"
                  value={phoneInput}
                  onChange={setPhoneInput}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleCustomSend)}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                />
              </div>
              
              <button 
                onClick={handleCustomSend} 
                disabled={!phoneInput || !customMessage.trim() || sending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {sending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <LoadingSpinner message={`Loading ${activeTab.toLowerCase()}...`} />
              ) : filteredEntities.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Users size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No {activeTab.toLowerCase()} found</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredEntities.map((entity) => (
                    <div
                      key={entity.id}
                      className={`flex items-center gap-3 p-3 mb-2 cursor-pointer rounded-xl transition-all duration-200 hover:bg-blue-50 ${
                        selectedEntity?.id === entity.id ? 'bg-gradient-to-r from-blue-100 to-purple-100 shadow-md' : ''
                      }`}
                      onClick={() => setSelectedEntity(entity)}
                    >
                      <Avatar entity={entity} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">
                          {entity.name || `${entity.firstName} ${entity.lastName}`}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {entity.phone || entity.phoneNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
            {selectedEntity ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Avatar entity={selectedEntity} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-gray-800 truncate">
                        {selectedEntity.name || `${selectedEntity.firstName} ${selectedEntity.lastName}`}
                      </h3>
                      <p className="text-gray-500 truncate">
                        {selectedEntity.phone || selectedEntity.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {chatLoading ? (
                    <LoadingSpinner message="Loading messages..." />
                  ) : chatLog.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Send size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No messages yet</p>
                        <p className="text-sm">Send the first message to start the conversation</p>
                      </div>
                    </div>
                  ) : (
                    chatLog.map((entry) => (
                      <MessageBubble key={entry.id} entry={entry} isOwn={entry.isOwn} />
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex gap-3 items-end">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleSend)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={sending}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!message.trim() || sending}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {sending ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Send size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                  <Users size={64} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">Select a {activeTab.slice(0, -1)}</h3>
                  <p className="text-gray-400">Choose someone from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatTabs;