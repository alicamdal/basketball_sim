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
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700/60 to-blue-800/60 px-5 py-3 text-white shadow-lg shadow-blue-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-900/60"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-base font-bold">Chat</span>
          {messages.length > 0 && (
            <span className="rounded-full bg-orange-400 px-2.5 py-1 text-xs font-black text-blue-900 shadow-md">
              {messages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex h-[400px] w-[420px] flex-col rounded-3xl border-4 border-blue-700/60 bg-gradient-to-br from-blue-700/60 via-blue-800/60 to-blue-900/60 shadow-2xl shadow-blue-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-white/30 bg-white/10 px-5 py-4 rounded-t-3xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-orange-400 animate-pulse shadow-lg shadow-orange-400/50" />
          <h3 className="text-lg font-black text-white drop-shadow-md">Game Chat</h3>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="rounded-full bg-white/20 p-2 text-white transition-all hover:scale-110 hover:bg-white/30 hover:rotate-180"
          aria-label="Minimize chat"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/5 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-base font-bold text-white/60 drop-shadow-md">No messages yet. Start chatting! 💬</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="group animate-[slideIn_0.3s_ease-out]">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 flex items-center justify-center text-sm font-black text-white shadow-lg border-2 border-white/50">
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Message bubble */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-black text-white drop-shadow-md">{msg.username}</span>
                    <span className="text-xs text-white/70 font-semibold">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white/95 px-4 py-3 shadow-lg border-2 border-blue-200/30">
                    <p className="text-sm font-semibold text-gray-800 break-words leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t-4 border-white/30 bg-white/10 p-4 rounded-b-3xl backdrop-blur-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message... 💬"
            className="flex-1 rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-gray-800 placeholder-gray-500 outline-none border-2 border-white/50 shadow-md transition-all focus:scale-[1.02] focus:border-orange-400 focus:shadow-lg"
            maxLength={200}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex-shrink-0 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg border-2 border-orange-300 transition-all hover:scale-110 hover:shadow-xl hover:from-orange-500 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
