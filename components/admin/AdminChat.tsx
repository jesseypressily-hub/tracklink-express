"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  MessageCircle,
  Send,
  User,
  Mail,
} from "lucide-react";

type Conversation = {
  id: string;
  name: string;
  email: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
};

type ChatMessage = {
  id: string;
  conversationId: string;
  sender: "customer" | "admin";
  message: string;
  createdAt: string;
  read: boolean;
};

export default function AdminChat() {
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(
    []
  );

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] =
    useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadConversations();

    const interval = setInterval(() => {
      loadConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedConversation]);

  async function loadConversations() {
    try {
      const response = await fetch(
        "/api/admin/chat/conversations"
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to load conversations."
        );
        return;
      }

      setConversations(data);
    } catch {
      setError(
        "Unable to connect to the chat server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    if (!selectedConversation) {
      return;
    }

    try {
      setLoadingMessages(true);

      const response = await fetch(
        `/api/chat/messages?conversationId=${selectedConversation.id}`
      );

      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      }
    } catch {
      // Keep existing messages if refresh fails.
    } finally {
      setLoadingMessages(false);
    }
  }

  async function sendMessage() {
    if (
      !selectedConversation ||
      !message.trim()
    ) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await fetch(
        "/api/chat/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId:
              selectedConversation.id,
            sender: "admin",
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to send message."
        );
        return;
      }

      setMessage("");

      await loadMessages();
      await loadConversations();
    } catch {
      setError(
        "Unable to connect to the chat server."
      );
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !sending
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Header */}
      <div className="border-b px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <MessageCircle size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--navy)]">
              Customer Support
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage live customer conversations.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600 sm:mx-8">
          {error}
        </div>
      )}

      <div className="grid min-h-[550px] md:grid-cols-[280px_1fr]">
        {/* Conversation List */}
        <div className="border-b md:border-b-0 md:border-r">
          <div className="border-b px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Conversations
            </p>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-8 text-gray-400">
                <Loader2
                  size={20}
                  className="animate-spin"
                />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No conversations yet.
              </div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() =>
                    setSelectedConversation(
                      conversation
                    )
                  }
                  className={`w-full border-b px-5 py-4 text-left transition ${
                    selectedConversation?.id ===
                    conversation.id
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--navy)]">
                        {conversation.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {conversation.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                        conversation.status ===
                        "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {conversation.status}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-gray-400">
                    {new Date(
                      conversation.updatedAt
                    ).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex min-h-[550px] flex-col">
          {!selectedConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-gray-400">
                <MessageCircle size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[var(--navy)]">
                Select a conversation
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Select a customer conversation from
                the list to view messages and reply.
              </p>
            </div>
          ) : (
            <>
              {/* Customer Header */}
              <div className="flex items-center gap-3 border-b px-5 py-4 sm:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User size={19} />
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-[var(--navy)]">
                    {selectedConversation.name}
                  </p>

                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <Mail size={12} />
                    {selectedConversation.email}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5 sm:p-6">
                {loadingMessages &&
                  messages.length === 0 && (
                    <div className="flex justify-center py-10 text-gray-400">
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                    </div>
                  )}

                {messages.length === 0 &&
                  !loadingMessages && (
                    <div className="py-10 text-center text-sm text-gray-500">
                      No messages yet.
                    </div>
                  )}

                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex ${
                      item.sender === "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                        item.sender === "admin"
                          ? "rounded-br-none bg-[var(--blue)] text-white"
                          : "rounded-bl-none bg-white text-gray-700 shadow-sm"
                      }`}
                    >
                      {item.message}

                      <p
                        className={`mt-1 text-[10px] ${
                          item.sender === "admin"
                            ? "text-white/70"
                            : "text-gray-400"
                        }`}
                      >
                        {new Date(
                          item.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply */}
              <div className="border-t bg-white p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Reply to customer..."
                    disabled={sending}
                    className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={
                      sending ||
                      !message.trim()
                    }
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--blue)] text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send reply"
                  >
                    {sending ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}