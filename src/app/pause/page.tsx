"use client";
import { useState } from "react";
import Link from "next/link";

export default function Pause() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello there. I sense that you might be feeling overwhelmed or perhaps seeking some gentle guidance today. Take a moment to pause and breathe—there’s no rush here, we can go at your pace.",
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return; 

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" }, 
    ]);
    setMessage(""); 

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      reader?.read().then(function processText({
        done,
        value,
      }: ReadableStreamReadResult<Uint8Array>): Promise<void> {
        if (done) {
          return Promise.resolve(); 
        }

        if (value) {
          const text = decoder.decode(value, {
            stream: true, 
          });


          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1]; 
            const otherMessages = prevMessages.slice(0, prevMessages.length - 1);

            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });
        }

        return reader.read().then(processText); 
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white items-center justify-end min-h-screen p-6 fade-in">
      <header className="w-full fixed top-0 pt-2 pb-2 left-0 bg-white">
          <Link href="/">
            <h1 className="text-2xl  text-center text-black font-bold cursor-pointer">wherewepause</h1>
          </Link>
      </header>

      <div className="max-w-md text-black w-full mt-16">
        <div className="p-4 rounded-lg mb-3 mt-3 mb-4">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`${
                msg.role === "user" ? "mt-2 text-right text-gray-600" : "mb-2 mt-2 text-black"
              }`}
            >
              {msg.role === "assistant" ? "🦔💬 " : "You: "}
              {msg.content}
            </p>
          ))}
        </div>

        <input
          type="text"
          placeholder="what’s on your mind right now?"
          className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-gray-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage(); 
          }}
        />
      </div>
    </div>
  );
}
