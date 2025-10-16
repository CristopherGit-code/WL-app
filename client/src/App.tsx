"use client"

import { useState } from "react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ChatTab from "./components/ChatTab"
import UploadTab from "./components/UploadTab"
import "./styles/app.css"

export default function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "upload">("chat")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} toggleSidebar={toggleSidebar} />

      <div className="main-content">
        <Sidebar
          isOpen={sidebarOpen}
          selectedDocuments={selectedDocuments}
          setSelectedDocuments={setSelectedDocuments}
        />

        <div className="content-area">
          {activeTab === "chat" ? <ChatTab selectedDocuments={selectedDocuments} /> : <UploadTab />}
        </div>
      </div>
    </div>
  )
}