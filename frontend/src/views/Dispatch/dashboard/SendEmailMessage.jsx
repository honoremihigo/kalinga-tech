import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Calendar, Filter, Mail, Send, Inbox, Trash2, AlertCircle, Star, Bold, Italic, Underline, Link, Paperclip, X, Menu, Reply, ReplyAll, Forward, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';

const GmailManager = () => {
  const [messages, setMessages] = useState([]);
  const [activeLabel, setActiveLabel] = useState('INBOX');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [replyMode, setReplyMode] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const [composeForm, setComposeForm] = useState({
    to: '',
    subject: '',
    message: '',
    isReply: false,
    replyToId: null
  });

  const labels = [
    { id: 'INBOX', name: 'Inbox', icon: Inbox, color: 'text-blue-600' },
    { id: 'SENT', name: 'Sent', icon: Send, color: 'text-green-600' },
    { id: 'SPAM', name: 'Spam', icon: AlertCircle, color: 'text-orange-600' },
    { id: 'TRASH', name: 'Trash', icon: Trash2, color: 'text-red-600' }
  ];

  // Rich Text Editor Functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const changeTextColor = (color) => {
    execCommand('foreColor', color);
  };

  const changeBackgroundColor = (color) => {
    execCommand('backColor', color);
  };

  const changeFontSize = (size) => {
    execCommand('fontSize', size);
  };

  const changeFontFamily = (font) => {
    execCommand('fontName', font);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setComposeForm(prev => ({
        ...prev,
        message: editorRef.current.innerHTML
      }));
    }
  };

  const extractMessageData = (message) => {
    if (!message) return null;
    
    return {
      id: message.id,
      threadId: message.threadId,
      from: message.from || '',
      to: message.to || '',
      subject: message.subject || '(no subject)',
      date: new Date(message.date || Date.now()),
      snippet: message.snippet || '',
      body: message.body || message.snippet || '',
      labels: message.labels || [],
      isUnread: message.isUnread || false,
      isImportant: message.isImportant || false,
      isStarred: message.isStarred || false
    };
  };

  const fetchMessages = async () => {
    setLoading(true);
    setSelectedMessage(null);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/gmail/messages?label=${activeLabel}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        const extractedMessages = data
          .map(extractMessageData)
          .filter(msg => msg !== null)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setMessages(extractedMessages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to fetch messages. Please try again.');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (message, mode = 'reply') => {
    setReplyMode(mode);
    let toField = '';
    let subjectPrefix = '';
    
    switch (mode) {
      case 'reply':
        toField = message.from;
        subjectPrefix = 'Re: ';
        break;
      case 'replyAll':
        toField = `${message.from}, ${message.to}`;
        subjectPrefix = 'Re: ';
        break;
      case 'forward':
        toField = '';
        subjectPrefix = 'Fwd: ';
        break;
      default:
        toField = message.from;
        subjectPrefix = 'Re: ';
    }

    const originalMessage = mode === 'forward' 
      ? `<br><br>---------- Forwarded message ----------<br><strong>From:</strong> ${message.from}<br><strong>Date:</strong> ${message.date.toLocaleString()}<br><strong>Subject:</strong> ${message.subject}<br><strong>To:</strong> ${message.to}<br><br>${message.body}`
      : `<br><br><br>---------- Original Message ----------<br><strong>From:</strong> ${message.from}<br><strong>Date:</strong> ${message.date.toLocaleString()}<br><strong>Subject:</strong> ${message.subject}<br><br>${message.body}`;

    setComposeForm({
      to: toField,
      subject: `${subjectPrefix}${message.subject.replace(/^(Re:|Fwd:)\s*/, '')}`,
      message: originalMessage,
      isReply: mode !== 'forward',
      replyToId: message.id
    });
    setShowCompose(true);

    // Set editor content after a brief delay to ensure it's rendered
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = originalMessage;
      }
    }, 100);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('to', composeForm.to);
      formData.append('subject', composeForm.subject);
      formData.append('message', editorRef.current?.innerHTML || composeForm.message);
      formData.append('isReply', composeForm.isReply);
      formData.append('replyToId', composeForm.replyToId);
      
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      const response = await fetch('http://localhost:3000/gmail/send', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('Email sent successfully!');
      setComposeForm({ to: '', subject: '', message: '', isReply: false, replyToId: null });
      setAttachments([]);
      setShowCompose(false);
      setReplyMode(null);
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      
      if (activeLabel === 'SENT') {
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending email:', err);
      alert('Failed to send email. Please try again.');
    }
  };

  const toggleStarred = async (messageId, currentlyStarred) => {
    try {
      const response = await fetch('http://localhost:3000/gmail/toggle-star', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, starred: !currentlyStarred })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMessages(messages.map(msg => 
        msg.id === messageId ? {...msg, isStarred: !currentlyStarred} : msg
      ));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({...selectedMessage, isStarred: !currentlyStarred});
      }
    } catch (err) {
      console.error('Error toggling star:', err);
    }
  };

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = !searchTerm || 
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.snippet.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || 
      msg.date.toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  useEffect(() => {
    fetchMessages();
  }, [activeLabel]);

  const formatDate = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (now - date < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getDisplayName = (emailString) => {
    if (!emailString) return 'Unknown';
    const match = emailString.match(/^(.+?)\s*<(.+?)>$/);
    return match ? match[1].replace(/"/g, '') : emailString.split('@')[0];
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleMessageClick = (message) => {
    if (selectedMessage && selectedMessage.id === message.id) {
      setSelectedMessage(null);
    } else {
      setSelectedMessage(message);
    }
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out`}>
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
            Gmail 
          </h1>
        </div>
        
        <div className="p-4">
          <button 
            onClick={() => {
              setShowCompose(true);
              setSidebarOpen(false);
            }}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <Plus className="w-4 h-4" />
            Compose
          </button>
        </div>

        <nav className="px-4 flex-1 overflow-y-auto">
          {labels.map(label => {
            const Icon = label.icon;
            return (
              <button
                key={label.id}
                onClick={() => {
                  setActiveLabel(label.id);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center gap-3 transition-colors ${
                  activeLabel === label.id 
                    ? 'bg-blue-100 text-blue-600 border-r-2 border-blue-600' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeLabel === label.id ? label.color : 'text-gray-500'}`} />
                {label.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Mobile Menu */}
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded-lg transition-colors ${
                showFilters ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          {showFilters && (
            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Message List and Detail View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Message List */}
          <div className={`${selectedMessage ? 'hidden lg:block lg:w-1/2' : 'w-full'} bg-white border-r border-gray-200 overflow-y-auto`}>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : error ? (
              <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg m-4">
                {error}
                <button 
                  onClick={fetchMessages}
                  className="ml-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Retry
                </button>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                {searchTerm || dateFilter ? 'No messages match your filters' : 'No messages found'}
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-3 lg:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors relative ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarred(message.id, message.isStarred);
                        }}
                        className="text-gray-400 hover:text-yellow-500 flex-shrink-0"
                      >
                        <Star className={`w-4 h-4 ${message.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                      </button>
                      <span className={`text-sm truncate ${message.isUnread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {getDisplayName(activeLabel === 'SENT' ? message.to : message.from)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatDate(message.date)}
                    </span>
                  </div>
                  <div className={`text-sm mb-1 truncate ${message.isUnread ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                    {message.subject}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {message.snippet}
                  </div>
                  {message.isUnread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full absolute left-1 top-4"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Message Detail View */}
          {selectedMessage && (
            <div className="w-full lg:w-1/2 bg-gray-50 flex flex-col overflow-hidden">
              <div className="p-4 lg:p-6 bg-white border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0 flex-1">
                    <button 
                      onClick={() => setSelectedMessage(null)}
                      className="lg:hidden mb-2 text-gray-500 hover:text-gray-700"
                    >
                      ← Back
                    </button>
                    <h2 className="text-lg lg:text-xl font-semibold truncate">{selectedMessage.subject}</h2>
                  </div>
                  <button 
                    onClick={() => toggleStarred(selectedMessage.id, selectedMessage.isStarred)}
                    className="text-gray-400 hover:text-yellow-500 ml-2 flex-shrink-0"
                  >
                    <Star className={`w-5 h-5 ${selectedMessage.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                  </button>
                </div>
                <div className="text-sm text-gray-600 space-y-2 mb-4">
                  <div className="truncate"><strong>From:</strong> {selectedMessage.from}</div>
                  <div className="truncate"><strong>To:</strong> {selectedMessage.to}</div>
                  <div><strong>Date:</strong> {selectedMessage.date.toLocaleString()}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={() => handleReply(selectedMessage, 'reply')}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </button>
                  <button 
                    onClick={() => handleReply(selectedMessage, 'replyAll')}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm flex items-center gap-1"
                  >
                    <ReplyAll className="w-3 h-3" />
                    Reply All
                  </button>
                  <button 
                    onClick={() => handleReply(selectedMessage, 'forward')}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm flex items-center gap-1"
                  >
                    <Forward className="w-3 h-3" />
                    Forward
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  <div 
                    className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800"
                    dangerouslySetInnerHTML={{ __html: selectedMessage.body }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col relative">
            {/* Fixed Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0 bg-white rounded-t-lg">
              <h3 className="text-lg font-semibold">
                {replyMode === 'reply' ? 'Reply' : replyMode === 'replyAll' ? 'Reply All' : replyMode === 'forward' ? 'Forward' : 'Compose Message'}
              </h3>
              <button
                onClick={() => {
                  setShowCompose(false);
                  setComposeForm({ to: '', subject: '', message: '', isReply: false, replyToId: null });
                  setAttachments([]);
                  setReplyMode(null);
                  if (editorRef.current) {
                    editorRef.current.innerHTML = '';
                  }
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSendEmail} className="h-full flex flex-col">
                <div className="p-4 space-y-4 flex-1">
                  {/* Email Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="email"
                      value={composeForm.to}
                      onChange={(e) => setComposeForm({...composeForm, to: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={composeForm.subject}
                      onChange={(e) => setComposeForm({...composeForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  {/* Rich Text Editor */}
                  <div className="border border-gray-300 rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
                    {/* Toolbar */}
                    <div className="bg-gray-50 p-2 border-b border-gray-300 flex flex-wrap gap-1 flex-shrink-0">
                      {/* Font Controls */}
                      <select 
                        onChange={(e) => changeFontFamily(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-1"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Verdana">Verdana</option>
                      </select>
                      
                      <select 
                        onChange={(e) => changeFontSize(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-1"
                      >
                        <option value="1">8pt</option>
                        <option value="2">10pt</option>
                        <option value="3" defaultValue>12pt</option>
                        <option value="4">14pt</option>
                        <option value="5">18pt</option>
                        <option value="6">24pt</option>
                        <option value="7">36pt</option>
                      </select>

                      {/* Formatting Controls */}
                      <div className="border-l border-gray-300 pl-1 ml-1 flex gap-1">
                        <button type="button" onClick={() => execCommand('bold')} className="p-1 hover:bg-gray-200 rounded" title="Bold">
                          <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('italic')} className="p-1 hover:bg-gray-200 rounded" title="Italic">
                          <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('underline')} className="p-1 hover:bg-gray-200 rounded" title="Underline">
                          <Underline className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Color Controls */}
                      <div className="border-l border-gray-300 pl-1 ml-1 flex gap-1">
                        <input 
                          type="color" 
                          onChange={(e) => changeTextColor(e.target.value)}
                          className="w-6 h-6 border border-gray-300 rounded cursor-pointer" 
                          title="Text Color"
                        />
                        <input 
                          type="color" 
                          onChange={(e) => changeBackgroundColor(e.target.value)}
                          className="w-6 h-6 border border-gray-300 rounded cursor-pointer" 
                          title="Background Color"
                        />
                      </div>

                      {/* Alignment Controls */}
                      <div className="border-l border-gray-300 pl-1 ml-1 flex gap-1">
                        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1 hover:bg-gray-200 rounded" title="Align Left">
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1 hover:bg-gray-200 rounded" title="Align Center">
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('justifyRight')} className="p-1 hover:bg-gray-200 rounded" title="Align Right">
                          <AlignRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* List Controls */}
                      <div className="border-l border-gray-300 pl-1 ml-1 flex gap-1">
                        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1 hover:bg-gray-200 rounded" title="Bullet List">
                          <List className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1 hover:bg-gray-200 rounded" title="Numbered List">
                          <ListOrdered className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('outdent')} className="p-1 hover:bg-gray-200 rounded text-xs px-2" title="Decrease Indent">
                          ⇤
                        </button>
                        <button type="button" onClick={() => execCommand('indent')} className="p-1 hover:bg-gray-200 rounded text-xs px-2" title="Increase Indent">
                          ⇥
                        </button>
                      </div>

                      {/* Additional Controls */}
                      <div className="border-l border-gray-300 pl-1 ml-1 flex gap-1">
                        <button type="button" onClick={insertLink} className="p-1 hover:bg-gray-200 rounded" title="Insert Link">
                          <Link className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('formatBlock', 'blockquote')} className="p-1 hover:bg-gray-200 rounded" title="Quote">
                          <Quote className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('removeFormat')} className="p-1 hover:bg-gray-200 rounded text-xs px-2" title="Clear Format">
                          Clear
                        </button>
                      </div>

                      {/* Undo/Redo */}
                      <div className="border-l border-gray-300 pl-1 ml-1 flex gap-1">
                        <button type="button" onClick={() => execCommand('undo')} className="p-1 hover:bg-gray-200 rounded" title="Undo">
                          <Undo className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('redo')} className="p-1 hover:bg-gray-200 rounded" title="Redo">
                          <Redo className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Attachment */}
                      <div className="border-l border-gray-300  pl-1 ml-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Attach File"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileAttachment}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Editor Content */}
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={handleEditorInput}
                      className="flex-1 p-3 focus:outline-none text-sm leading-relaxed overflow-y-auto min-h-[200px]"
                      style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                      suppressContentEditableWarning={true}
                    />
                  </div>

                  {/* Attachments Display */}
                  {attachments.length > 0 && (
                    <div className="border  border-gray-300 rounded-lg p-3 mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        Attachments ({attachments.length})
                      </h4>
                      <div className="space-y-2 flex m-6 max-h-24 overflow-y-auto">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center m-1 justify-between bg-gray-50 p-2 rounded text-sm">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Paperclip className="w-3 h-3 text-gray-500 flex-shrink-0" />
                              <span className="truncate">{file.name}</span>
                              <span className="text-gray-500 text-xs flex-shrink-0">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Fixed Footer with Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white rounded-b-lg flex gap-2 justify-end shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setShowCompose(false);
                  setComposeForm({ to: '', subject: '', message: '', isReply: false, replyToId: null });
                  setAttachments([]);
                  setReplyMode(null);
                  if (editorRef.current) {
                    editorRef.current.innerHTML = '';
                  }
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GmailManager;