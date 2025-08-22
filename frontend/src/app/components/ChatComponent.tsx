"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  timestamp: Date;
  text: string;
};

export default function ChatComponent() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const host = window.location.hostname;
    const socket = new WebSocket(`ws://${host}:5001/ws`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected");
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      const receivedMessage: Message = {
        timestamp: new Date(),
        text: event.data,
      };
      setMessages((prev) => [...prev, receivedMessage]);
    };

    socket.onclose = () => {
      console.log("Connection closed");
    };

    socket.onerror = (error) => {
      console.log("Error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      console.log("Message send");
      socketRef.current.send(message);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <ul className="chat-messages">
        {messages.map((message, index) => (
          <li className="chat-message" key={index}>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="message-text">{message.text}</div>
          </li>
        ))}
      </ul>

      <input
        className="chat-input"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send message</button>
    </div>
  );
}
