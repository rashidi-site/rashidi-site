import { supabase } from "../lib/supabase";
import { Poetry, PoetryFormData } from "../types/poetry";

// ===============================
// Get All Poetry
// ===============================
export async function getAllPoetry(): Promise<Poetry[]> {
  const { data, error } = await supabase
    .from("poetry")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Poetry[];
}

// ===============================
// Published Poetry
// ===============================
export async function getPublishedPoetry(): Promise<Poetry[]> {
  const { data, error } = await supabase
    .from("poetry")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Poetry[];
}

// ===============================
// Featured Poetry
// ===============================
export async function getFeaturedPoetry(): Promise<Poetry[]> {
  const { data, error } = await supabase
    .from("poetry")
    .select("*")
    .eq("featured", true)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Poetry[];
}

// ===============================
// Get By Slug
// ===============================
export async function getPoetryBySlug(slug: string): Promise<Poetry | null> {
  const { data, error } = await supabase
    .from("poetry")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;

  return data as Poetry;
}

// ===============================
// Create Poetry
// ===============================
export async function createPoetry(
  poem: PoetryFormData
): Promise<boolean> {
  const { error } = await supabase
    .from("poetry")
    .insert([poem]);

  if (error) throw error;

  return true;
}

// ===============================
// Update Poetry
// ===============================
export async function updatePoetry(
  id: string,
  poem: Partial<PoetryFormData>
): Promise<boolean> {
  const { error } = await supabase
    .from("poetry")
    .update(poem)
    .eq("id", id);

  if (error) throw error;

  return true;
}

// ===============================
// Delete Poetry
// ===============================
export async function deletePoetry(
  id: string
): Promise<boolean> {
  const { error } = await supabase
    .from("poetry")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}

// ===============================
// Search Poetry
// ===============================
export async function searchPoetry(
  keyword: string
): Promise<Poetry[]> {
  const { data, error } = await supabase
    .from("poetry")
    .select("*")
    .or(
      `title.ilike.%${keyword}%,content.ilike.%${keyword}%,author.ilike.%${keyword}%`
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Poetry[];
}
// ===============================
// Upload Poetry Cover Image
// ===============================
export async function uploadPoetryImage(
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const filePath = `covers/${fileName}`;

  const { error } = await supabase.storage
  .from("poetry-images")
  .upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage
  .from("poetry-images")
  .getPublicUrl(filePath);

if (!data.publicUrl) {
  throw new Error("Failed to generate public image URL.");
}

return data.publicUrl;
}