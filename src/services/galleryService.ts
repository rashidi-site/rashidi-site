import { supabase } from "../lib/supabase";
import type { GalleryItem, GalleryRecord } from "../types/gallery";

function mapGalleryRecord(record: GalleryRecord): GalleryItem {
  return {
    id: record.id,
    src: record.image_url ?? "",
    title: record.title,
    description: record.description ?? "",
    category: record.category,
    featured: record.featured,
    status: record.status,
    created_at: record.created_at,
  };
}

export async function getPublishedGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => mapGalleryRecord(item as GalleryRecord));
}

export async function getFeaturedGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => mapGalleryRecord(item as GalleryRecord));
}

export async function getAllGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => mapGalleryRecord(item as GalleryRecord));
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) throw error;
}

export async function uploadGalleryImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `images/${fileName}`;

  const { error } = await supabase.storage.from("gallery").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error("Failed to generate public image URL.");
  }

  return data.publicUrl;
}
