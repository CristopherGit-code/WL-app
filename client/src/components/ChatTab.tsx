"use client"

import type React from "react"
import { useState } from "react"
import '../styles/chatTab.css'

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatTabProps {
  selectedDocuments: string[]
}

export default function ChatTab({ selectedDocuments }: ChatTabProps) {
  console.log(selectedDocuments)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your document assistant. Ask me anything about your documents.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputValue("")

    // Simulate AI response
    // TODO: Send fetch to server
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I received your message: "${inputValue}". ${selectedDocuments.length > 0 ? `I'm analyzing ${selectedDocuments.length} selected document(s).` : "Please select documents from the sidebar to get specific answers."}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className="chat-container">
      {/* <div className="chat-header">
        <h2>Chat with Documents</h2>
        {selectedDocuments.length > 0 && (
          <span>{selectedDocuments.length} document(s) selected</span>
        )}
      </div> */}

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-avatar">{message.role === "user" ? "U" : "AI"}</div>
            <div className="message-content">
              <p>{message.content}</p>
              <span className="message-time">{message.timestamp.toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask a question about your documents..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  )
}
