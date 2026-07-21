export type QuoteStatus = "draft" | "published";

export interface Quote {
  id: string;
  quote: string;
  author: string;
  source: string | null;
  category: string;
  featured: boolean;
  status: QuoteStatus;
  cover_image: string | null;
  likes: number;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteFormData {
  quote: string;
  author: string;
  source: string;
  category: string;
  featured: boolean;
  status: QuoteStatus;
  cover_image: string;
  likes?: number;
  views?: number;
}
