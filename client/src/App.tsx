"use client"

import { useEffect, useState } from "react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ChatTab from "./components/ChatTab"
import UploadTab from "./components/UploadTab"
import "./styles/app.css"

interface Filters {
  uniqueYears: string[]
  uniqueType: string[]
  uniqueRegion: string[]
  uniqueCustomer: string[]
}

const initialData:Filters = {
  uniqueYears: ["All"],
  uniqueCustomer: ["Example"],
  uniqueRegion: ["US"],
  uniqueType: ["loss"]
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "upload">("chat")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [availableFilters, setAvailableFilters] = useState<Filters>(initialData)
  const [userID, setUserID] = useState("")
  const SERVER_URL = "http://localhost:8000"

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const getAvailableFilters = async () => {
    const URL = SERVER_URL + "/available_filters"

    try {
      const response = await fetch(URL, {
        method: "GET"
      })

      if (!response.ok) {
        throw new Error("Server query error, try manual filters")
      }

      const data: Filters = await response.json()

      setAvailableFilters(data)
    } catch (error) {
      console.error("Error getting query filters", error)
      setAvailableFilters(initialData)
    }
  }

  const getUserID = async () => {
    const URL = SERVER_URL + "/user_session"

    try {
      const response = await fetch(URL, {
        method: "GET"
      })

      if (!response.ok) {
        throw new Error("Server query error, try manual filters")
      }

      const data = await response.json()

      setUserID(data.session)
    } catch (error) {
      console.error("Error getting query filters", error)
      setUserID("1234")
    }
  }

  useEffect(() => {
    const getInitData = async () => {
      await getAvailableFilters();
      await getUserID();
    }

    getInitData();
  }, [])

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} toggleSidebar={toggleSidebar} />

      <div className="main-content">
        <Sidebar
          isOpen={sidebarOpen}
          currentAvailableFilters={availableFilters}
          userID={userID}
        />

        <div className="content-area">
          {activeTab === "chat" ? <ChatTab userID={userID} /> : <UploadTab />}
        </div>
      </div>
    </div>
  )
}