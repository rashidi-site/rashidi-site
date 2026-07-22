import { supabase } from "../lib/supabase";

export interface MessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function mapMessageRecord(record: MessageRecord): MessageItem {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    subject: record.subject,
    message: record.message,
    is_read: record.is_read,
    created_at: record.created_at,
  };
}

export async function createMessage(payload: Omit<MessageItem, "id" | "is_read" | "created_at">): Promise<void> {
  const { error } = await supabase.from("messages").insert([
    {
      ...payload,
      is_read: false,
    },
  ]);

  if (error) throw error;
}

export async function getMessages(): Promise<MessageItem[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => mapMessageRecord(item as MessageRecord));
}

export async function markMessageAsRead(id: string): Promise<void> {
  const { error } = await supabase.from("messages").update({ is_read: true }).eq("id", id);

  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) throw error;
}
