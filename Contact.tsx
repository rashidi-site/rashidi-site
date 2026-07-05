import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Youtube, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                رابطہ کریں
              </span>
            </h1>
            <p className="text-xl text-amber-200/60">Get in Touch</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                پیغام بھیجیں
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-200/80 text-sm mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      آپ کا نام
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="نام"
                      style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-amber-200/80 text-sm mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      ای میل
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-amber-200/80 text-sm mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    موضوع
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="موضوع"
                    style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                  />
                </div>
                <div>
                  <label className="block text-amber-200/80 text-sm mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    پیغام
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    placeholder="اپنا پیغام لکھیں..."
                    style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  پیغام بھیجیں
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Info Cards */}
            <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-1" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>پتہ</h3>
                  <p className="text-amber-200/60" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>کراچی، پاکستان</p>
                  <p className="text-amber-100/40 text-sm">Karachi, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-1" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>ای میل</h3>
                  <a href="mailto:info@abdulwahed.com" className="text-amber-200/60 hover:text-amber-400 transition-colors">info@abdulwahed.com</a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-1" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>فون</h3>
                  <a href="tel:+923001234567" className="text-amber-200/60 hover:text-amber-400 transition-colors">+92 300 123 4567</a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-1" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>وقت</h3>
                  <p className="text-amber-200/60" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>پیر تا ہفتہ: صبح 9 بجے تا شام 6 بجے</p>
                  <p className="text-amber-100/40 text-sm">Mon - Sat: 9 AM - 6 PM</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h3 className="text-lg font-semibold text-amber-400 mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>سوشل میڈیا</h3>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, color: 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' },
                  { icon: Twitter, color: 'bg-sky-600/20 text-sky-400 hover:bg-sky-600/30' },
                  { icon: Instagram, color: 'bg-pink-600/20 text-pink-400 hover:bg-pink-600/30' },
                  { icon: Youtube, color: 'bg-red-600/20 text-red-400 hover:bg-red-600/30' },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center transition-colors`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-amber-500/10 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231839.87852845358!2d67.009033!3d24.8607343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e70a31fbae3%3A0x4eae9c1c4e5e0f8!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(1.1)' }}
                loading="lazy"
                title="Location Map"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}