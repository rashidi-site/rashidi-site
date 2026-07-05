import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, BookOpen, Award, Heart, Pen } from 'lucide-react';

export default function About() {
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
                مصنف کے بارے میں
              </span>
            </h1>
            <p className="text-xl text-amber-200/60">About the Author</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 rounded-2xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/20">
              <img
                src="https://images.pexels.com/photos/69224/pexels-photo-69224.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Abdul Wahed Rashidi"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="text-3xl font-bold text-amber-400 mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  عبدالواحد راشدی
                </h2>
                <p className="text-amber-200/80">Urdu Poet & Islamic Scholar</p>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Pen className="w-8 h-8 text-slate-950" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  عبدالواحد راشدی
                </h3>
                <p className="text-amber-200/60">Poet • Scholar • Author</p>
              </div>
            </div>

            <div className="space-y-4 text-amber-100/70 leading-relaxed">
              <p style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                عبدالواحد راشدی ایک ممتاز اردو شاعر اور اسلامی سکالر ہیں۔ ان کی شاعری میں محبت، روحانیت اور انسانی جذبات کا خوبصورت امتزاج ملتا ہے۔ ان کے کلام میں اردو ادب کی گہرائی اور اسلامی تعلیمات کی روشنی کا عکس نظر آتا ہے۔
              </p>
              <p style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                انہوں نے کئی دہائیوں تک اردو شاعری اور اسلامی ادب کی خدمت کی ہے۔ ان کی شاعری نہ صرف پاکستان بلکہ پوری دنیا میں پڑھی اور سراہی جاتی ہے۔
              </p>
              <p>
                Abdul Wahed Rashidi is a distinguished Urdu poet and Islamic scholar whose work beautifully 
                weaves together themes of love, spirituality, and human emotion. His poetry reflects the depth 
                of Urdu literature and the guiding light of Islamic teachings.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-8">
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
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
        >
          {[
            { icon: BookOpen, value: '500+', label: 'شاعری', labelEn: 'Poems' },
            { icon: Heart, value: '10K+', label: 'قارئین', labelEn: 'Readers' },
            { icon: Award, value: '15+', label: 'ایوارڈ', labelEn: 'Awards' },
            { icon: Pen, value: '25+', label: 'سال تجربہ', labelEn: 'Years' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-slate-950" />
              </div>
              <p className="text-3xl font-bold text-amber-400 mb-1">{stat.value}</p>
              <p className="text-amber-200/60 text-sm" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{stat.label}</p>
              <p className="text-amber-100/40 text-xs">{stat.labelEn}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <div className="inline-block p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
            <p className="text-amber-200/60 mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>دستخط</p>
            <p className="text-4xl text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              عبدالواحد راشدی
            </p>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}