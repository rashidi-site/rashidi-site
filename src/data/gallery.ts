export interface GalleryImage {
  id: number;
  src: string;
  title: string;
  category: string;
  description: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.pexels.com/photos/1618547/pexels-photo-1618547.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "مسجد نبوی",
    category: "مساجد",
    description: "مدینہ منورہ میں مسجد نبوی کا حسین منظر"
  },
  {
    id: 2,
    src: "https://images.pexels.com/photos/69224/pexels-photo-69224.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "خوبصورت غروب",
    category: "فطرت",
    description: "غروب آفتاب کا حسین منظر"
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "رمضان کی راتیں",
    category: "رمضان",
    description: "رمضان المبارک کی راتوں کا جادو"
  },
  {
    id: 4,
    src: "https://images.pexels.com/photos/1693095/pexels-photo-1693095.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "پہاڑوں کا سفر",
    category: "فطرت",
    description: "پہاڑوں میں سفر کی خوبصورتی"
  },
  {
    id: 5,
    src: "https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "کعبہ شریف",
    category: "مساجد",
    description: "خانہ کعبہ کا مبارک منظر"
  },
  {
    id: 6,
    src: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "کتاب کی دعا",
    category: "دعا",
    description: "دعا کا روحانی لمحہ"
  },
  {
    id: 7,
    src: "https://images.pexels.com/photos/3707991/pexels-photo-3707991.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "اوراق کی خوبصورتی",
    category: "فن",
    description: "خوشنویسی کا فن"
  },
  {
    id: 8,
    src: "https://images.pexels.com/photos/176851/pexels-photo-176851.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "تاریک رات",
    category: "فطرت",
    description: "ستاروں بھری رات کا جادو"
  },
  {
    id: 9,
    src: "https://images.pexels.com/photos/1000653/pexels-photo-1000653.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "مسجد کا مینار",
    category: "مساجد",
    description: "مسجد کے مینار کی خوبصورتی"
  },
  {
    id: 10,
    src: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "پھولوں کی خوشبو",
    category: "فطرت",
    description: "پھولوں کی رنگینی"
  },
  {
    id: 11,
    src: "https://images.pexels.com/photos/2693529/pexels-photo-2693529.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "قدیم کتابیں",
    category: "فن",
    description: "قدیم کتابوں کا حسین منظر"
  },
  {
    id: 12,
    src: "https://images.pexels.com/photos/3704861/pexels-photo-3704861.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "نماز کا لمحہ",
    category: "دعا",
    description: "سجدے کا روحانی لمحہ"
  }
];

export const galleryCategories = ["تمام", "مساجد", "فطرت", "رمضان", "دعا", "فن"];