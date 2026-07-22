export interface GalleryRecord {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string;
  featured: boolean;
  status: "draft" | "published";
  created_at: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  status: "draft" | "published";
  created_at: string;
}
