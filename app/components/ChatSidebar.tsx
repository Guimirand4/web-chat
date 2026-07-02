"use client";

import type { Conversation } from "../lib/chatData";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
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
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const groups = groupByDate(conversations);

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
            onClick={onNewChat}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "var(--border-radius-md)",
              border: "1px dashed var(--border-color)",
              background: "transparent",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all var(--transition-base)",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-primary)";
              e.currentTarget.style.color = "var(--accent-primary)";
              e.currentTarget.style.background = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova Conversa
          </button>
        </div>

        {/* Conversation List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 12px 16px",
          }}
        >
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
                return (
                  <button
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--border-radius-sm)",
                      border: "none",
                      background: isActive ? "var(--bg-active)" : "transparent",
                      color: isActive ? "var(--accent-primary)" : "var(--text-primary)",
                      fontSize: "13.5px",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "3px",
                      textAlign: "left",
                      transition: "all var(--transition-fast)",
                      fontFamily: "inherit",
                      marginBottom: "2px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "var(--bg-hover)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {conv.title}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-tertiary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {conv.preview}
                    </span>
                  </button>
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
            U
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
              Usuário
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
              usuario@email.com
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          aria-label="Abrir menu"
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            zIndex: 50,
            width: "40px",
            height: "40px",
            borderRadius: "var(--border-radius-sm)",
            border: "1px solid var(--border-color)",
            background: "var(--bg-glass)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        @media (max-width: 768px) {
          #chat-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
          }
          .sidebar-overlay {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
