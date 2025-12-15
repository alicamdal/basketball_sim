"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Message = {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  avatar?: string;
};

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Demo messages for testing
  useEffect(() => {
    setMessages([
      {
        id: "1",
        username: "Player1",
        message: "Good game everyone!",
        timestamp: new Date(Date.now() - 120000),
      },
      {
        id: "2",
        username: "CoachMike",
        message: "Let's focus on defense",
        timestamp: new Date(Date.now() - 60000),
      },
    ]);
  }, []);

  function handleSend() {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      username: "You",
      message: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // TODO: Send to server via API
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-white shadow-lg backdrop-blur-md transition-all hover:bg-black/60"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-sm font-semibold">Chat</span>
          {messages.length > 0 && (
            <span className="rounded bg-white/20 px-2 py-1 text-[12px] font-semibold">
              {messages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex h-[280px] w-[520px] flex-col rounded-xl border border-white/20 bg-black/50 shadow-lg backdrop-blur-md text-base">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-white">Game Chat</h3>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="rounded p-1 text-white/60 transition-all hover:bg-white/10 hover:text-white"
          aria-label="Minimize chat"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-white/40">No messages yet 💬</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="animate-[slideIn_0.2s_ease-out]">
              <div className="flex items-baseline gap-2">
                <span className="text-[12px] font-semibold text-white/70 flex-shrink-0">
                  {msg.username}:
                </span>
                <span className="text-[12px] text-white/90 break-words">
                  {msg.message}
                </span>
                <span className="text-[11px] text-white/30 flex-shrink-0 ml-auto">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-[13px] text-white placeholder-white/40 outline-none border border-white/10 transition-all focus:border-white/30 focus:bg-white/15"
            maxLength={200}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex-shrink-0 rounded-lg bg-white/20 px-2.5 py-1.5 text-white transition-all hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/20"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
