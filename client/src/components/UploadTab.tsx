"use client"

import type React from "react"
import { useState } from "react"
import '../styles/uploadTab.css'

export default function UploadTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentTitle, setDocumentTitle] = useState("")
  const [documentCategory, setDocumentCategory] = useState("")
  const [documentDescription, setDocumentDescription] = useState("")
  const [uploadStatus, setUploadStatus] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      // Auto-fill title with filename
      setDocumentTitle(e.target.files[0].name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setUploadStatus("Please select a file to upload")
      return
    }

    // Simulate upload
    setUploadStatus("Uploading...")
    setTimeout(() => {
      setUploadStatus("Document uploaded successfully!")
      // Reset form
      setSelectedFile(null)
      setDocumentTitle("")
      setDocumentCategory("")
      setDocumentDescription("")

      // Clear file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      setTimeout(() => setUploadStatus(""), 3000)
    }, 1500)
  }

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2>Upload Documents</h2>
        <p>Upload documents to add them to your knowledge base</p>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file-upload" className="file-label">
            Select File
          </label>
          <input
            id="file-upload"
            type="file"
            className="file-input"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
          />
          {selectedFile && (
            <div className="file-preview">
              <span className="file-icon">📄</span>
              <div className="file-details">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="doc-title">Document Title</label>
          <input
            id="doc-title"
            type="text"
            className="form-input"
            placeholder="Enter document title"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="doc-category">Category</label>
          <select
            id="doc-category"
            className="form-select"
            value={documentCategory}
            onChange={(e) => setDocumentCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="proposal">Proposal</option>
            <option value="technical">Technical</option>
            <option value="financial">Financial</option>
            <option value="notes">Notes</option>
            <option value="design">Design</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="doc-description">Description</label>
          <textarea
            id="doc-description"
            className="form-textarea"
            placeholder="Enter document description (optional)"
            value={documentDescription}
            onChange={(e) => setDocumentDescription(e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" className="submit-btn">
          Upload Document
        </button>

        {uploadStatus && (
          <div className={`upload-status ${uploadStatus.includes("success") ? "success" : ""}`}>{uploadStatus}</div>
        )}
      </form>
    </div>
  )
}
