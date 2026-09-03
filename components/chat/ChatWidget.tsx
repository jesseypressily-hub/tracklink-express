"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "447882506376";

type Message = {
  id: string;
  conversationId: string;
  sender: "customer" | "admin";
  message: string;
  createdAt: string;
  read: boolean;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [conversationId, setConversationId] =
    useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  const [startingChat, setStartingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(
    null
  );

  const whatsappMessage = encodeURIComponent(
    "Hello TrackLink Express, I need assistance."
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  /*
   * Restore customer information and conversation
   * when the page is loaded again.
   */
  useEffect(() => {
    const savedConversationId =
      localStorage.getItem(
        "tracklink_chat_conversation"
      );

    const savedName =
      localStorage.getItem("tracklink_chat_name");

    const savedEmail =
      localStorage.getItem("tracklink_chat_email");

    if (savedConversationId) {
      setConversationId(savedConversationId);
    }

    if (savedName) {
      setName(savedName);
    }

    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  /*
   * Load messages whenever a conversation exists.
   */
  useEffect(() => {
    if (!conversationId) {
      return;
    }

    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId]);

  /*
   * Scroll to the latest message.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function loadMessages() {
    if (!conversationId) {
      return;
    }

    try {
      setLoadingMessages(true);

      const response = await fetch(
        `/api/chat/messages?conversationId=${conversationId}`
      );

      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      }
    } catch {
      // Keep the existing messages if loading fails.
    } finally {
      setLoadingMessages(false);
    }
  }

  async function startChat() {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setStartingChat(true);

      const response = await fetch(
        "/api/chat/conversations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Unable to start chat."
        );
        return;
      }

      localStorage.setItem(
        "tracklink_chat_conversation",
        data.conversationId
      );

      localStorage.setItem(
        "tracklink_chat_name",
        name.trim()
      );

      localStorage.setItem(
        "tracklink_chat_email",
        email.trim()
      );

      setConversationId(data.conversationId);
    } catch {
      setError(
        "Unable to connect to the support server."
      );
    } finally {
      setStartingChat(false);
    }
  }

  async function sendMessage() {
    if (!conversationId || !message.trim()) {
      return;
    }

    setError("");

    try {
      setSending(true);

      const response = await fetch(
        "/api/chat/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId,
            sender: "customer",
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Unable to send message."
        );
        return;
      }

      setMessage("");

      await loadMessages();
    } catch {
      setError(
        "Unable to connect to the support server."
      );
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter" && !sending) {
      event.preventDefault();
      sendMessage();
    }
  }

  function closeAll() {
    setOpen(false);
    setChatOpen(false);
  }

  function openLiveChat() {
    setOpen(false);
    setChatOpen(true);
  }

  return (
    <>
      {/* Live Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-40px)] max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 sm:right-6">

          {/* Header */}
          <div className="flex items-center justify-between bg-[var(--blue)] px-5 py-4 text-white">
            <div>
              <h3 className="font-bold">
                TrackLink Support
              </h3>

              <p className="mt-0.5 text-xs text-white/80">
                We’re here to help
              </p>
            </div>

            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="rounded-lg p-2 transition hover:bg-white/10"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Customer Information */}
          {!conversationId ? (
            <div className="p-5">
              <h4 className="text-lg font-bold text-[var(--navy)]">
                Start a conversation
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Tell us who you are and our support team
                will assist you.
              </p>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-5 space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Your email address"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={startChat}
                  disabled={startingChat}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-4 py-3 font-bold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {startingChat ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Starting...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={18} />
                      Start Live Chat
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Conversation */
            <div className="flex h-[28rem] flex-col">

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-5">

                {loadingMessages &&
                  messages.length === 0 && (
                    <div className="flex justify-center py-10 text-gray-400">
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                    </div>
                  )}

                {messages.length === 0 && !loadingMessages && (
                  <div className="text-center text-sm text-gray-500">
                    <p className="font-semibold">
                      Welcome to TrackLink Express.
                    </p>

                    <p className="mt-1">
                      Send us a message and we'll get back
                      to you.
                    </p>
                  </div>
                )}

                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex ${
                      item.sender === "customer"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        item.sender === "customer"
                          ? "rounded-br-none bg-[var(--blue)] text-white"
                          : "rounded-bl-none bg-slate-100 text-gray-700"
                      }`}
                    >
                      {item.message}
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 pb-2">
                  <p className="rounded-lg bg-red-50 p-2 text-xs font-semibold text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={
                      sending || !message.trim()
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--blue)] text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send message"
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
            </div>
          )}
        </div>
      )}

      {/* Support Menu */}
      {open && !chatOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-64 overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/10 sm:right-6">

          <button
            type="button"
            onClick={openLiveChat}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-slate-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <MessageSquare size={20} />
            </span>

            <span>
              <span className="block text-sm font-bold text-[var(--navy)]">
                Live Chat
              </span>

              <span className="block text-xs text-gray-500">
                Chat with our support team
              </span>
            </span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-slate-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <FaWhatsapp size={21} />
            </span>

            <span>
              <span className="block text-sm font-bold text-[var(--navy)]">
                WhatsApp
              </span>

              <span className="block text-xs text-gray-500">
                Chat with us on WhatsApp
              </span>
            </span>
          </a>
        </div>
      )}

      {/* Floating Support Button */}
      <button
        type="button"
        onClick={() => {
          if (chatOpen) {
            closeAll();
          } else {
            setOpen(!open);
          }
        }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--blue)] text-white shadow-xl transition hover:scale-105 hover:shadow-2xl sm:right-6"
        aria-label="Customer support"
      >
        {open || chatOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={25} />
        )}
      </button>
    </>
  );
}