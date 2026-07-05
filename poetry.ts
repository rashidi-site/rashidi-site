export interface Poem {
  id: number;
  title: string;
  urduText: string;
  englishTranslation: string;
  category: string;
  date: string;
  likes: number;
  featured: boolean;
}

export const poems: Poem[] = [
  {
    id: 1,
    title: "محبت کی راہ",
    urduText: "محبت کی راہ میں قدم بڑھاتے چلو\nڈر نہیں کچھ بھی، دل کو آزماتے چلو\nجس طرف پیار کا چراغ جلتا ہے\nاُس طرف اپنے دل کے ساتھ جاتے چلو",
    englishTranslation: "Walk forward on the path of love\nFear nothing, keep testing your heart\nWherever the lamp of love burns\nWalk in that direction with your heart",
    category: "محبت",
    date: "2024-01-15",
    likes: 245,
    featured: true
  },
  {
    id: 2,
    title: "خدا کی یاد",
    urduText: "خدا کی یاد میں گزر جائے شب\nکہ ہر لمحہ ہے اُس کا قرب\nسجدے میں جب جبیں رکھی\nمل گیا مجھ کو اپنا رب",
    englishTranslation: "Let the night pass in remembrance of God\nEvery moment is His nearness\nWhen I placed my forehead in prostration\nI found my Lord",
    category: "روحانیت",
    date: "2024-01-20",
    likes: 312,
    featured: true
  },
  {
    id: 3,
    title: "زندگی کا سفر",
    urduText: "زندگی کا سفر ہے طویل اور مشکل\nلیکن ہر موڑ پر ملے امید کی کرن\nآؤ ہم مل کر چلیں اس راہ پر\nکہ منزل ملے گی یقیناً مگر",
    englishTranslation: "Life's journey is long and difficult\nBut at every turn, a ray of hope appears\nCome, let us walk this path together\nThe destination will surely be found",
    category: "زندگی",
    date: "2024-02-01",
    likes: 189,
    featured: false
  },
  {
    id: 4,
    title: "دل کی باتیں",
    urduText: "دل کی باتیں کہاں تک سناؤں\nکہ ہر بات میں ہے درد چھپا\nآنسوؤں کے ساتھ لکھی ہر سطر\nکہ ہر لفظ میں ہے دل کا سودا",
    englishTranslation: "How much of my heart's words should I share\nWhen every word hides pain\nEvery line written with tears\nEvery word holds my heart's longing",
    category: "غم",
    date: "2024-02-10",
    likes: 156,
    featured: false
  },
  {
    id: 5,
    title: "امید کی کرن",
    urduText: "اندھیری رات میں بھی ستارے ہوتے ہیں\nمصیبت میں بھی سہارے ہوتے ہیں\nہمت سے کام لو، ہار مت مانو\nکہ زندگی میں بہت پیارے ہوتے ہیں",
    englishTranslation: "Even in the dark night, there are stars\nEven in trouble, there is support\nBe courageous, don't accept defeat\nFor life holds many dear ones",
    category: "امید",
    date: "2024-02-15",
    likes: 278,
    featured: true
  },
  {
    id: 6,
    title: "رمضان کی فضیلت",
    urduText: "رمضان کا مہینہ رحمت کا موسم\nجس میں نازل ہوا قرآن کا نظام\nروزے رکھو، نماز پڑھو\nکہ جنت میں ملے گا ہر کام",
    englishTranslation: "Ramadan is the month of mercy\nIn which the Quran was revealed\nFast and pray\nFor every deed will be rewarded in Paradise",
    category: "رمضان",
    date: "2024-03-01",
    likes: 445,
    featured: true
  },
  {
    id: 7,
    title: "دعائے مغفرت",
    urduText: "اللہ مجھے بخش دے میرے گناہوں کو\nمیری کمزوریوں کو طاقت بنا دے\nتیرے در کا فقیر ہوں میں\nاپنے دل کو تجھ سے جڑا دے",
    englishTranslation: "O Allah, forgive my sins\nTurn my weaknesses into strength\nI am a beggar at Your door\nConnect my heart to You",
    category: "دعا",
    date: "2024-03-10",
    likes: 367,
    featured: false
  },
  {
    id: 8,
    title: "مادر کا پیار",
    urduText: "ماں کے پاؤں کے نیچے جنت ہے\nاُس کا پیار خدا کی نعمت ہے\nخدمت کرو اُس کی عمر بھر\nکہ یہ فرض ہے، یہی عبادت ہے",
    englishTranslation: "Paradise lies beneath mother's feet\nHer love is God's blessing\nServe her all your life\nFor this is duty, this is worship",
    category: "مادر",
    date: "2024-03-15",
    likes: 523,
    featured: true
  }
];

export const categories = ["محبت", "روحانیت", "زندگی", "غم", "امید", "رمضان", "دعا", "مادر"];