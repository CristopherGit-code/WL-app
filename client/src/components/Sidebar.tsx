"use client"

import { useState, useEffect } from "react"
import '../styles/sidebar.css'

interface Filters {
  uniqueYears: string[]
  uniqueType: string[]
  uniqueRegion: string[]
  uniqueCustomer: string[]
}

interface SidebarProps {
  isOpen: boolean
  currentAvailableFilters: Filters
  userID: string
}

type documentData = [string, string]

interface DocumentsFromDB {
  previewList: documentData[]
}

export default function Sidebar({ isOpen, currentAvailableFilters, userID }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [type, setType] = useState("")
  const [region, setRegion] = useState("")
  const [customer, setCustomer] = useState("")
  const [product, setProduct] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [documentList, setDocumentList] = useState<string[][]>([[]])

  const SERVER_URL = "http://localhost:8000"

  const searchByQuery = async () => {
    if (!searchQuery.trim()) return;

    const prompt = searchQuery
    const URL = SERVER_URL + "/get_client_filters"

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt,
          userID: userID
        })
      })

      if (!response.ok) {
        throw new Error("Server query error, try manual filters")
      }

      const data: DocumentsFromDB = await response.json()

      console.log(data.previewList)
      setDocumentList(data.previewList)
    } catch (error) {
      console.error("Error getting query filters", error)
    }
  }

  const handleFilters = async () => {
    const URL = SERVER_URL + "/get_client_manual_filters"

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          year: startDate,
          endYear: endDate,
          type: type,
          region: region,
          customer: customer,
          product: product,
          userID: userID
        })
      })

      if (!response.ok) {
        throw new Error("Server query error, try manual filters")
      }

      const data: DocumentsFromDB = await response.json()

      console.log(data.previewList)
      setDocumentList(data.previewList)
    } catch (error) {
      console.error("Error getting query filters", error)
    }
  }

  const handleCheckboxChange = (docId: string) => {
    // if (selectedDocuments.includes(docId)) {
    //   setSelectedDocuments(selectedDocuments.filter((id) => id !== docId))
    // } else {
    //   setSelectedDocuments([...selectedDocuments, docId])
    // }
  }

  const handleDownload = (doc: string[]) => {
    // Simulate download
    // alert(`Downloading ${doc[1]}`)
    const blob = new Blob([doc[1]], { type: "text/markdown" })
    const fileName = doc[0]+'.txt'

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName

    link.click()

    URL.revokeObjectURL(link.href)
  }

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <div className="filters-section">
          <h2 className="sidebar-title">Filter Documents</h2>

          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <form action={searchByQuery}>
              <input
                id="search"
                type="text"
                className="filter-input"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="filter-group">
            <label htmlFor="start-date">Date Range</label>
            <div className="date-range">
              <select
                id="category"
                className="filter-select"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              >
                {currentAvailableFilters.uniqueYears.map((year,i)=>(
                  <option value={year} key={i}>{year}</option>
                ))}
              </select>
              <span className="date-separator">to</span>
              <select
                id="category"
                className="filter-select"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              >
                {currentAvailableFilters.uniqueYears.map((year,i)=>(
                  <option value={year} key={i}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="category">Type</label>
            <select
              id="category"
              className="filter-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {currentAvailableFilters.uniqueType.map((type,i)=>(
                  <option value={type} key={i}>{type}</option>
                ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="category">Region</label>
            <select
              id="category"
              className="filter-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {currentAvailableFilters.uniqueRegion.map((region,i)=>(
                  <option value={region} key={i}>{region}</option>
                ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="category">Customer</label>
            <select
              id="category"
              className="filter-select"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            >
              {currentAvailableFilters.uniqueCustomer.map((customer,i)=>(
                  <option value={customer} key={i}>{customer}</option>
                ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="search">Product</label>
            <input
              id="search"
              type="text"
              className="filter-input"
              placeholder="Products to search..."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>

          <button onClick={handleFilters} className="send-btn">Apply filters</button>
        </div>

        <div className="documents-section">
          <h3 className="documents-title">Documents ({documentList.length})</h3>

          <div className="documents-list">
            {documentList.map((doc, i) => (
              <div key={i} className="document-item">
                {/* <div className="document-checkbox">
                  <input
                    type="checkbox"
                    id={`doc-${i}`}
                    checked={selectedDocuments.includes("1")}
                    onChange={() => handleCheckboxChange("1")}
                  />
                </div> */}
                <div className="document-info">
                  <label htmlFor={`doc-${i}`} className="document-name">{doc[0]}</label>
                </div>
                <button
                  className="download-btn"
                  onClick={() => handleDownload(doc)}
                  aria-label={`Download ${doc[0]}`}
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
