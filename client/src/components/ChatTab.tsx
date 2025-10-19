"use client"

import type React from "react"
import { useState } from "react"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import '../styles/chatTab.css'

interface ChatProps {
  userID: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatTab({ userID }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your document assistant. Ask me anything about your documents.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const SERVER_URL = "http://localhost:8000"

  const getChatResponse = async (inputValue: Message): Promise<string> => {
    const prompt = inputValue.content
    const URL = SERVER_URL + "/get_client_analysis"

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt,
          sys_instructions: "",
          userID: userID
        })
      })

      if (!response.ok) {
        throw new Error("Server query error, try manual filters")
      }

      const data = await response.json()

      console.log(data.response)

      return data.response
    } catch (error) {
      console.error("Error getting query filters", error)
      return "Error in getting the response from the server"
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
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

    const chatResponse = await getChatResponse(userMessage)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: chatResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
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
              <div className="md-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
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
