import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Pen, LogOut, Mail, User, Calendar, Trash2, Reply } from 'lucide-react';
import { deleteMessage, getMessages, markMessageAsRead } from '../../services/messageService';
import type { MessageItem } from '../../services/messageService';

export default function AdminMessages() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate('/admin');
      }
    };

    void checkSession();
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      try {
        const data = await getMessages();
        if (isMounted) {
          setMessages(data);
          if (data[0]) {
            setSelectedMessage(data[0]);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadMessages();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMessages = messages.filter((msg) => {
    return msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) || msg.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      setMessages((existingMessages) => existingMessages.filter((message) => message.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectMessage = async (message: MessageItem) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      try {
        await markMessageAsRead(message.id);
        setMessages((existingMessages) => existingMessages.map((item) => (item.id === message.id ? { ...item, is_read: true } : item)));
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Pen className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                پیغامات
              </h1>
              <p className="text-amber-200/60 text-sm">Contact Messages</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 backdrop-blur border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 overflow-hidden">
            <div className="p-4 bg-amber-500/10 border-b border-amber-500/10">
              <p className="text-amber-400 font-semibold">{filteredMessages.length} Messages</p>
            </div>
            <div className="divide-y divide-amber-500/10 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-sm text-amber-200/70">Loading messages…</div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-4 text-sm text-amber-200/70">No messages found.</div>
              ) : filteredMessages.map((msg, index) => (
                <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} onClick={() => void handleSelectMessage(msg)} className={`cursor-pointer p-4 transition-colors ${selectedMessage?.id === msg.id ? 'bg-amber-500/10' : 'hover:bg-amber-500/5'}`}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{msg.name}</span>
                    {!msg.is_read && <span className="h-2 w-2 rounded-full bg-green-500" />}
                  </div>
                  <p className="truncate text-sm text-amber-200/60" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{msg.subject}</p>
                  <p className="mt-1 text-xs text-amber-100/40">{new Date(msg.created_at).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 p-6">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-950" />
                    </div>
                    <div>
                      <h3 className="text-amber-400 font-semibold" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{selectedMessage.name}</h3>
                      <p className="text-amber-200/60 text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedMessage.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                      <Reply className="w-5 h-5" />
                    </button>
                    <button onClick={() => void handleDelete(selectedMessage.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-amber-200/60 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedMessage.created_at).toLocaleDateString()}
                  </p>
                </div>

                <h2 className="text-xl font-bold text-amber-400 mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {selectedMessage.subject}
                </h2>

                <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-amber-200/80 leading-relaxed" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    {selectedMessage.message}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-amber-400/30 mx-auto mb-4" />
                <p className="text-amber-200/60" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  پیغام منتخب کریں
                </p>
                <p className="text-amber-100/40 text-sm">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
