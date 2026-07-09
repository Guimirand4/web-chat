import { authFetch } from "./auth";

// ─── Tipos da API ───────────────────────────────────────────

export interface ApiMessage {
  id: number;
  conversation_id: number;
  sender: "user" | "bot";
  content: string;
  created_at: string;
}

export interface ApiConversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ApiMessage[];
}

export interface ApiConversationPreview {
  id: number;
  title: string;
  preview: string;
  updated_at: string;
}

// ─── Endpoints ──────────────────────────────────────────────

/** Lista todas as conversas do usuário (sidebar) */
export async function listConversations(): Promise<ApiConversationPreview[]> {
  const res = await authFetch("/conversations");
  if (!res.ok) throw new Error("Falha ao buscar conversas");
  return res.json();
}

/**
 * Cria uma nova conversa.
 * Lança erro com status 403 se o limite de 2 conversas for atingido.
 */
export async function createConversation(): Promise<ApiConversation> {
  const res = await authFetch("/conversations", { method: "POST" });
  if (res.status === 403) {
    const data = await res.json();
    throw Object.assign(new Error(data.detail ?? "Limite atingido"), {
      status: 403,
    });
  }
  if (!res.ok) throw new Error("Falha ao criar conversa");
  return res.json();
}

/** Busca os detalhes de uma conversa com todas as mensagens */
export async function getConversation(id: number): Promise<ApiConversation> {
  const res = await authFetch(`/conversations/${id}`);
  if (!res.ok) throw new Error("Conversa não encontrada");
  return res.json();
}

/** Apaga uma conversa */
export async function deleteConversation(id: number): Promise<void> {
  const res = await authFetch(`/conversations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Falha ao apagar conversa");
}

/**
 * Envia uma mensagem e recebe a resposta do bot (Gemini).
 * Retorna apenas a MessageResponse do bot.
 */
export async function sendMessage(
  conversationId: number,
  content: string
): Promise<ApiMessage> {
  const res = await authFetch(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Falha ao enviar mensagem");
  return res.json();
}
