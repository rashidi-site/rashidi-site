import { supabase } from "../lib/supabase";
import type { Quote, QuoteFormData } from "../types/quotes";

export async function getAllQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Quote[];
}

export async function getQuoteCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("quote_categories")
    .select("name")
    .order("name", { ascending: true });

  if (error) throw error;

  return (data ?? [])
    .map((item) => item.name)
    .filter(Boolean);
}

export async function getPublishedQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Quote[];
}

export async function getFeaturedQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("featured", true)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Quote[];
}

export async function createQuote(quote: QuoteFormData): Promise<boolean> {
  const payload = {
    ...quote,
    likes: quote.likes ?? 0,
    views: quote.views ?? 0,
  };

  const { error } = await supabase.from("quotes").insert([payload]);

  if (error) throw error;

  return true;
}

export async function updateQuote(id: string, quote: Partial<QuoteFormData>): Promise<boolean> {
  const payload = {
    ...quote,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("quotes").update(payload).eq("id", id);

  if (error) throw error;

  return true;
}

export async function deleteQuote(id: string): Promise<boolean> {
  const { error } = await supabase.from("quotes").delete().eq("id", id);

  if (error) throw error;

  return true;
}

export async function searchQuotes(keyword: string): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .or(`quote.ilike.%${keyword}%,author.ilike.%${keyword}%,category.ilike.%${keyword}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Quote[];
}

export async function uploadQuoteImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  const { error } = await supabase.storage.from("quote-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("quote-images").getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error("Failed to generate public image URL.");
  }

  return data.publicUrl;
}
// Duplicates removed above — keep single implementation at top of file.
