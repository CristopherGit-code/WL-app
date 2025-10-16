"use client"
import '../styles/header.css'

interface HeaderProps {
  activeTab: "chat" | "upload"
  setActiveTab: (tab: "chat" | "upload") => void
  toggleSidebar: () => void
}

export default function Header({ activeTab, setActiveTab, toggleSidebar }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <h1 className="header-title">Document Assistant</h1>
      </div>

      <nav className="header-tabs">
        <button className={`tab-btn ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
          Chat
        </button>
        <button className={`tab-btn ${activeTab === "upload" ? "active" : ""}`} onClick={() => setActiveTab("upload")}>
          Upload Documents
        </button>
      </nav>
    </header>
  )
}
