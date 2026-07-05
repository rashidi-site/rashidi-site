export interface Quote {
  id: number;
  urduText: string;
  englishText: string;
  source: string;
  category: string;
}

export const quotes: Quote[] = [
  {
    id: 1,
    urduText: "بے شک اللہ کے ساتھ صبر کرنے والوں کے ساتھ ہے",
    englishText: "Indeed, Allah is with those who are patient.",
    source: "قرآن - سورۃ البقرہ: ۱۵۳",
    category: "صبر"
  },
  {
    id: 2,
    urduText: "اور جو اللہ سے ڈرے گا، اُس کے لیے راستہ بنا دے گا",
    englishText: "And whoever fears Allah - He will make for him a way out.",
    source: "قرآن - سورۃ الطلاق: ۲",
    category: "تقویٰ"
  },
  {
    id: 3,
    urduText: "اچھائی کا بدلہ اچھائی ہے",
    englishText: "The reward of goodness is nothing but goodness.",
    source: "قرآن - سورۃ الرحمن: ۶۰",
    category: "نیکی"
  },
  {
    id: 4,
    urduText: "اللہ کی یاد سے دلیں قرار پاتی ہیں",
    englishText: "Verily, in the remembrance of Allah do hearts find rest.",
    source: "قرآن - سورۃ الرعد: ۲۸",
    category: "ذكر"
  },
  {
    id: 5,
    urduText: "اللہ بندوں پر رحیم ہے",
    englishText: "Allah is Most Merciful to His servants.",
    source: "قرآن - سورۃ البقرہ: ۱۴۳",
    category: "رحمت"
  },
  {
    id: 6,
    urduText: "تم میں سے بہتر وہ ہے جو قرآن سیکھے اور سکھائے",
    englishText: "The best among you are those who learn the Quran and teach it.",
    source: "حدیث - بخاری",
    category: "علم"
  },
  {
    id: 7,
    urduText: "مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے محفوظ رہیں",
    englishText: "A Muslim is one from whose tongue and hand others are safe.",
    source: "حدیث - بخاری",
    category: "اخلاق"
  },
  {
    id: 8,
    urduText: "جو اللہ اور قیامت پر ایمان رکھتا ہو، وہ بھلائی کی بات کرے یا خاموش رہے",
    englishText: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    source: "حدیث - بخاری",
    category: "اخلاق"
  },
  {
    id: 9,
    urduText: "دنیا میں ایسے رہو گویا اجنبی ہو",
    englishText: "Be in this world as if you were a stranger.",
    source: "حدیث - بخاری",
    category: "زندگی"
  },
  {
    id: 10,
    urduText: "اللہ کی رحمت امید سے ناامید نہ ہو",
    englishText: "Do not despair of the mercy of Allah.",
    source: "قرآن - سورۃ الزمر: ۵۳",
    category: "امید"
  },
  {
    id: 11,
    urduText: "نماز قائم کرو کیونکہ نماز برائی سے روکتی ہے",
    englishText: "Establish prayer, for prayer prevents immorality.",
    source: "قرآن - سورۃ العنکبوت: ۴۵",
    category: "نماز"
  },
  {
    id: 12,
    urduText: "تمہارا رب فرماتا ہے: مجھے پکارو میں تمہیں جواب دوں گا",
    englishText: "Your Lord says: Call upon Me, I will respond to you.",
    source: "قرآن - سورۃ غافر: ۶۰",
    category: "دعا"
  }
];