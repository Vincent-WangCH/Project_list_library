"use client";

import { useChat } from "@ai-sdk/react";
import { Send, Bot, User } from "lucide-react";
import { useState } from "react";
import { HomeButton } from "../components/HomeButton";

const MessageList = ({ messages }: { messages: any[] }) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Bot className="w-16 h-16 mb-4 text-gray-400" />
        <p className="text-lg font-medium">Welcome to MiniWiki</p>
        <p className="text-sm">Ask questions about your repository</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          {message.role === "assistant" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            {message.parts.map((part: any, index: number) => {
              if (part.type === "text") {
                return (
                  <p key={index} className="whitespace-pre-wrap">
                    {part.text}
                  </p>
                );
              }
              return null;
            })}
          </div>
          {message.role === "user" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ChatInput = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
}: {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your repository..."
        disabled={isLoading}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        <Send className="w-4 h-4" />
        Send
      </button>
    </form>
  );
};

export default function Home() {
  const { messages, status, sendMessage } = useChat();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const isLoading = status !== "ready";

  return (
    <main className="flex flex-col h-screen bg-white">
      {/* Home button */}
      <HomeButton variant="light" />

      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4 pl-20">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">MiniWiki</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Chat with your repository using AI</p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <MessageList messages={messages} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-6 py-4">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}