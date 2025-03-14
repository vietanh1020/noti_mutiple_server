"use client"; // Để chạy trên client-side trong Next.js App Router

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import styles from "./page.module.css";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {

    console.log({ SOCKET_SERVER_URL });

    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket?.emit("sendMessage", { message: input });
      setInput("");
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image className={styles.logo} src="/next.svg" alt="Next.js logo" width={180} height={38} priority />

        <h2 className="text-xl font-bold mt-4">💬 Real-time Chat</h2>

        <div className="w-96 h-64 bg-white p-4 border border-gray-300 rounded-lg overflow-auto">
          {messages.map((msg, index) => (
            <p key={index} className="p-2 border-b">{msg}</p>
          ))}
        </div>

        <div className="mt-4 flex space-x-2">
          <input
            className="border p-2 w-72 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
            Gửi
          </button>
        </div>
      </main>
    </div>
  );
}
