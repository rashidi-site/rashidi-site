import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Pen, LogOut, Mail, User, Calendar, Trash2, Reply } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const messages: Message[] = [
  { id: 1, name: 'احمد علی', email: 'ahmad@example.com', subject: 'شاعری کی تعریف', message: 'آپ کی شاعری بہت خوبصورت ہے۔ اللہ آپ کو مزید عطا فرمائے۔', date: '2024-03-15', read: false },
  { id: 2, name: 'فاطمہ زہرا', email: 'fatima@example.com', subject: 'رمضان کی فضیلت', message: 'رمضان کے بارے میں آپ کی تحریر بہت معلوماتی ہے۔', date: '2024-03-14', read: true },
  { id: 3, name: 'محمد عمر', email: 'umar@example.com', subject: 'سوال', message: 'کیا آپ کی کتابیں دستیاب ہیں؟', date: '2024-03-13', read: false },
  { id: 4, name: 'عبداللہ', email: 'abdullah@example.com', subject: 'دعائے مغفرت', message: 'دعائے مغفرت کی شاعری بہت روحانی ہے۔', date: '2024-03-12', read: true },
  { id: 5, name: 'زینب', email: 'zainab@example.com', subject: 'گیلری', message: 'گیلری میں تصاویر بہت حسین ہیں۔', date: '2024-03-11', read: false },
];

export default function AdminMessages() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate('/admin');
    }
  };

  checkSession();
}, [navigate]);

  checkSession();
}, [navigate]);

  const filteredMessages = messages.filter((msg) => {
    return msg.name.includes(searchQuery) || msg.subject.includes(searchQuery) || msg.email.includes(searchQuery);
  });

  const handleLogout = async () => {
  await supabase.auth.signOut();
  navigate('/admin');
};

  const handleDelete = (id: number) => {
    alert(`Message with ID ${id} would be deleted`);
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
              {filteredMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === msg.id ? 'bg-amber-500/10' : 'hover:bg-amber-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">\n                    <span className="text-amber-400 font-semibold" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{msg.name}</span>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-green-500" />}
                  </div>
                  <p className="text-amber-200/60 text-sm truncate" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{msg.subject}</p>
                  <p className="text-amber-100/40 text-xs mt-1">{msg.date}</p>
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
                  <div className="flex items-center gap-4">\n                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
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
                    <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-amber-200/60 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {selectedMessage.date}
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