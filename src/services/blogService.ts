import { supabase } from "../lib/supabase";

export interface BlogPostRecord {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  author: string;
  cover_image: string | null;
  featured: boolean;
  status: "draft" | "published";
  category: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: string;
  cover_image: string | null;
  featured: boolean;
  status: "draft" | "published";
  category: string;
  views: number;
  created_at: string;
  updated_at: string;
}

function mapBlogRecord(record: BlogPostRecord): BlogPostItem {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    excerpt: record.excerpt ?? "",
    slug: record.slug,
    author: record.author,
    cover_image: record.cover_image,
    featured: record.featured,
    status: record.status,
    category: record.category,
    views: record.views,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
}

export async function getPublishedBlogPosts(): Promise<BlogPostItem[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => mapBlogRecord(item as BlogPostRecord));
}

export async function getAllBlogPosts(): Promise<BlogPostItem[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => mapBlogRecord(item as BlogPostRecord));
}

export async function getFeaturedBlogPosts(): Promise<BlogPostItem[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => mapBlogRecord(item as BlogPostRecord));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;

  return mapBlogRecord(data as BlogPostRecord);
}

export async function updateBlogPostViews(id: string, views: number): Promise<void> {
  const { error } = await supabase.from("blog_posts").update({ views }).eq("id", id);

  if (error) throw error;
}

export interface BlogPostFormData {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: string;
  cover_image: string;
  featured: boolean;
  status: "draft" | "published";
  category: string;
}

export async function createBlogPost(payload: BlogPostFormData): Promise<void> {
  const { error } = await supabase.from("blog_posts").insert([
    {
      ...payload,
      views: 0,
    },
  ]);

  if (error) throw error;
}

export async function updateBlogPost(id: string, payload: Partial<BlogPostFormData>): Promise<void> {
  const { error } = await supabase
    .from("blog_posts")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw error;
}

export async function uploadBlogImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  const { error } = await supabase.storage.from("blog-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error("Failed to generate public image URL.");
  }

  return data.publicUrl;
}
