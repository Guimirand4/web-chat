"use client";

import { useState } from "react";
import type { Conversation } from "../lib/chatData";
import type { User } from "../lib/auth";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  user: User | null;
  onLogout: () => void;
  isAtLimit: boolean;
  limitError: string | null;
  isFetchingHistory: boolean;
}

function groupByDate(conversations: Conversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Hoje", items: [] },
    { label: "Ontem", items: [] },
    { label: "Últimos 7 dias", items: [] },
    { label: "Mais antigos", items: [] },
  ];

  for (const conv of conversations) {
    const date = new Date(conv.updatedAt);
    if (date >= today) {
      groups[0].items.push(conv);
    } else if (date >= yesterday) {
      groups[1].items.push(conv);
    } else if (date >= lastWeek) {
      groups[2].items.push(conv);
    } else {
      groups[3].items.push(conv);
    }
  }

  return groups.filter((g) => g.items.length > 0);
}

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDeleteConversation,
  isOpen,
  onToggle,
  user,
  onLogout,
  isAtLimit,
  limitError,
  isFetchingHistory,
}: ChatSidebarProps) {
  const groups = groupByDate(conversations);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? "U";
  const userName = user?.name ?? "Usuário";
  const userEmail = user?.email ?? "";

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeletingId(id);
    await onDeleteConversation(id);
    setDeletingId(null);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--bg-overlay)",
            zIndex: 40,
            display: "none",
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        id="chat-sidebar"
        style={{
          width: "var(--sidebar-width)",
          minWidth: "var(--sidebar-width)",
          height: "100dvh",
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          transition: "transform var(--transition-base)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          position: isOpen ? "relative" : "absolute",
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            height: "var(--header-height)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--border-radius-sm)",
                background: "var(--accent-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: "15px", color: "var(--text-primary)" }}>
              ChatBot IA
            </span>
          </div>

          {/* Close button (mobile) */}
          <button
            onClick={onToggle}
            aria-label="Fechar menu"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--border-radius-sm)",
              transition: "color var(--transition-fast)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div style={{ padding: "16px 16px 8px" }}>
          <button
            id="new-chat-btn"
            onClick={isAtLimit ? undefined : onNewChat}
            disabled={isAtLimit}
            title={
              isAtLimit
                ? "Limite atingido: apague uma conversa para criar uma nova"
                : "Nova Conversa"
            }
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "var(--border-radius-md)",
              border: `1px dashed ${isAtLimit ? "var(--text-tertiary)" : "var(--border-color)"}`,
              background: "transparent",
              color: isAtLimit ? "var(--text-tertiary)" : "var(--text-primary)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: isAtLimit ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all var(--transition-base)",
              fontFamily: "inherit",
              opacity: isAtLimit ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (isAtLimit) return;
              e.currentTarget.style.borderColor = "var(--accent-primary)";
              e.currentTarget.style.color = "var(--accent-primary)";
              e.currentTarget.style.background = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              if (isAtLimit) return;
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            {isAtLimit ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
            {isAtLimit ? "Limite atingido (2/2)" : "Nova Conversa"}
          </button>

          {/* Mensagem de erro do limite */}
          {limitError && (
            <div
              className="animate-fade-in"
              style={{
                marginTop: "8px",
                padding: "10px 12px",
                borderRadius: "var(--border-radius-sm)",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                fontSize: "12px",
                color: "#ef4444",
                lineHeight: 1.5,
              }}
            >
              {limitError}
            </div>
          )}
        </div>

        {/* Conversation List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 12px 16px",
          }}
        >
          {/* Loading skeleton */}
          {isFetchingHistory && (
            <div style={{ padding: "8px" }}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    height: "56px",
                    borderRadius: "var(--border-radius-sm)",
                    background: "var(--bg-hover)",
                    marginBottom: "8px",
                    animation: "pulse 1.5s ease-in-out infinite",
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>
          )}

          {!isFetchingHistory && groups.length === 0 && (
            <div
              style={{
                padding: "32px 16px",
                textAlign: "center",
                color: "var(--text-tertiary)",
                fontSize: "13px",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Nenhuma conversa ainda.
              <br />
              Clique em &quot;Nova Conversa&quot;!
            </div>
          )}

          {groups.map((group) => (
            <div key={group.label} style={{ marginBottom: "16px" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-tertiary)",
                  padding: "8px 8px 6px",
                }}
              >
                {group.label}
              </span>

              {group.items.map((conv) => {
                const isActive = conv.id === activeId;
                const isDeleting = deletingId === conv.id;
                return (
                  <div
                    key={conv.id}
                    style={{ position: "relative", marginBottom: "2px" }}
                    onMouseEnter={() => setHoveredId(conv.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <button
                      onClick={() => onSelect(conv.id)}
                      disabled={isDeleting}
                      style={{
                        width: "100%",
                        padding: "10px 40px 10px 12px",
                        borderRadius: "var(--border-radius-sm)",
                        border: "none",
                        background: isActive ? "var(--bg-active)" : "transparent",
                        color: isActive ? "var(--accent-primary)" : "var(--text-primary)",
                        fontSize: "13.5px",
                        fontWeight: isActive ? 600 : 400,
                        cursor: isDeleting ? "not-allowed" : "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "3px",
                        textAlign: "left",
                        transition: "all var(--transition-fast)",
                        fontFamily: "inherit",
                        opacity: isDeleting ? 0.4 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = "var(--bg-hover)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                        {conv.title}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                        {conv.preview || "Nenhuma mensagem enviada."}
                      </span>
                    </button>

                    {/* Delete button — aparece no hover */}
                    {(hoveredId === conv.id || isActive) && !isDeleting && (
                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        aria-label="Apagar conversa"
                        title="Apagar conversa"
                        className="animate-fade-in"
                        style={{
                          position: "absolute",
                          right: "6px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "var(--text-tertiary)",
                          cursor: "pointer",
                          padding: "4px",
                          borderRadius: "var(--border-radius-sm)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "color var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    )}

                    {/* Spinner de delete */}
                    {isDeleting && (
                      <div
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "14px",
                          height: "14px",
                          border: "2px solid var(--border-color)",
                          borderTopColor: "#ef4444",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* User footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          {user?.picture ? (
            <img
              src={user.picture}
              alt={userName}
              style={{ width: "32px", height: "32px", borderRadius: "var(--border-radius-full)", objectFit: "cover" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--border-radius-full)",
                background: "var(--accent-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: "white",
              }}
            >
              {userInitial}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userName}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userEmail}
            </div>
          </div>
          {/* Logout button */}
          <button
            onClick={onLogout}
            aria-label="Sair"
            title="Sair da conta"
            style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: "6px", borderRadius: "var(--border-radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", transition: "color var(--transition-fast)", flexShrink: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          aria-label="Abrir menu"
          style={{
            position: "fixed", top: "16px", left: "16px", zIndex: 50,
            width: "40px", height: "40px",
            borderRadius: "var(--border-radius-sm)",
            border: "1px solid var(--border-color)",
            background: "var(--bg-glass)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            transition: "all var(--transition-base)",
          }}
          className="animate-fade-in"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @media (max-width: 768px) {
          #chat-sidebar { position: fixed !important; left: 0; top: 0; }
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}
