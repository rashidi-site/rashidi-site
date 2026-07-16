export interface Poetry {
  id: string;

  title: string;

  content: string;

  author: string;

  category: string;

  english_translation: string | null;

  slug: string;

  cover_image: string | null;

  featured: boolean;

  likes: number;

  views: number;

  status: "draft" | "published";

  created_at: string;

  updated_at: string;
}

export interface PoetryFormData {
  title: string;

  content: string;

  author: string;

  category: string;

  english_translation: string;

  slug: string;

  cover_image: string;

  featured: boolean;

  status: "draft" | "published";
}