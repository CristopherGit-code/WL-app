"use client"

import { useState, useEffect } from "react"
import '../styles/sidebar.css'

interface Document {
  id: string
  name: string
  date: string
  category: string
  size: string
}

interface SidebarProps {
  isOpen: boolean
  selectedDocuments: string[]
  setSelectedDocuments: (docs: string[]) => void
}

export default function Sidebar({ isOpen, selectedDocuments, setSelectedDocuments }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Mock documents data
  const mockDocuments: Document[] = [
    { id: "1", name: "Project Proposal.pdf", date: "2024-01-15", category: "proposal", size: "2.3 MB" },
    { id: "2", name: "Technical Specs.docx", date: "2024-01-20", category: "technical", size: "1.8 MB" },
    { id: "3", name: "Budget Report.xlsx", date: "2024-02-01", category: "financial", size: "890 KB" },
    { id: "4", name: "Meeting Notes.pdf", date: "2024-02-10", category: "notes", size: "450 KB" },
    { id: "5", name: "Design Mockups.pdf", date: "2024-02-15", category: "design", size: "5.2 MB" },
  ]

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    const matchesDateRange = (!startDate || doc.date >= startDate) && (!endDate || doc.date <= endDate)
    return matchesSearch && matchesCategory && matchesDateRange
  })

  useEffect(() => {
    const filteredIds = filteredDocuments.map((doc)=>doc.id)
    setSelectedDocuments(filteredIds)
  }, [searchQuery,categoryFilter,startDate,endDate])

  const handleCheckboxChange = (docId: string) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== docId))
    } else {
      setSelectedDocuments([...selectedDocuments, docId])
    }
  }

  const handleDownload = (doc: Document) => {
    // Simulate download
    alert(`Downloading ${doc.name}`)
  }

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <div className="filters-section">
          <h2 className="sidebar-title">Filter Documents</h2>

          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              className="filter-input"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="proposal">Proposal</option>
              <option value="technical">Technical</option>
              <option value="financial">Financial</option>
              <option value="notes">Notes</option>
              <option value="design">Design</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="start-date">Date Range</label>
            <div className="date-range">
              <input
                id="start-date"
                type="date"
                className="filter-input date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="date-separator">to</span>
              <input
                id="end-date"
                type="date"
                className="filter-input date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="documents-section">
          <h3 className="documents-title">Documents ({filteredDocuments.length})</h3>

          <div className="documents-list">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-checkbox">
                  <input
                    type="checkbox"
                    id={`doc-${doc.id}`}
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => handleCheckboxChange(doc.id)}
                  />
                </div>

                <div className="document-info">
                  <label htmlFor={`doc-${doc.id}`} className="document-name">
                    {doc.name}
                  </label>
                  <div className="document-meta">
                    <span className="document-date">{doc.date}</span>
                    <span className="document-size">{doc.size}</span>
                  </div>
                </div>

                <button
                  className="download-btn"
                  onClick={() => handleDownload(doc)}
                  aria-label={`Download ${doc.name}`}
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
