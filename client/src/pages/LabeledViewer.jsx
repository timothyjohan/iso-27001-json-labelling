import { use, useEffect, useState } from "react";
import axios from "axios";

export default function LabeledViewer() {
  const [entries, setEntries] = useState([]);
  const [expandedIndices, setExpandedIndices] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const validCount = entries.filter((e) => {
    const assistant = e.messages.find((m) => m.role === "assistant");
    if (!assistant) return false;
    try {
      const parsed = JSON.parse(assistant.content);
      return parsed.result === "Valid";
    } catch {
      return false;
    }
  }).length;

  const invalidCount = entries.filter((e) => {
    const assistant = e.messages.find((m) => m.role === "assistant");
    if (!assistant) return false;
    try {
      const parsed = JSON.parse(assistant.content);
      return parsed.result === "Invalid";
    } catch {
      return false;
    }
  }).length;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/dataset`)
      .then((res) => setEntries(res.data))
      .catch((err) => console.error("Failed to load dataset", err));
  }, []);

  const totalPages = Math.ceil(entries.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentEntries = entries.slice(startIndex, startIndex + pageSize);

  const toggleExpand = (index) => {
    setExpandedIndices((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const handlePageChange = (dir) => {
    setCurrentPage((prev) => {
      const next = prev + dir;
      if (next < 1 || next > totalPages) return prev;
      return next;
    });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const delta = 2;

    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let lastPage = 0;
    for (let page of range) {
      if (page - lastPage > 1) {
        pages.push(<span key={`ellipsis-${page}`}>...</span>);
      }

      pages.push(
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded border ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-800 hover:bg-blue-100"
          }`}
        >
          {page}
        </button>
      );

      lastPage = page;
    }

    return pages;
  };
  const handleDownload = () => {
    const blob = new Blob(
      entries.map((e) => (JSON.stringify(e) + '\n')),
      { type: 'text/plain;charset=utf-8' }
    );
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'datasetv1.jsonl';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📂 Labeled Dataset</h1>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Valid:</span> {validCount} |
          <span className="font-semibold ml-2">Invalid:</span> {invalidCount} |
          <span className="font-semibold ml-2">Total:</span> {entries.length}
        </div>

        {/* 🧩 Download Button */}
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          ⬇️ Download Dataset
        </button>
      </div>

      {/* Pagination controls */}
      <div className="my-6 flex justify-center items-center gap-2 flex-wrap">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          ◀ Prev
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
      <div className="space-y-4">
        {currentEntries.map((entry, i) => {
          const realIndex = startIndex + i;
          const userMsg = entry.messages.find((m) => m.role === "user");
          const assistantMsg = entry.messages.find(
            (m) => m.role === "assistant"
          );

          const userText = userMsg?.content || "";
          const assistantText = assistantMsg?.content || "";
          const isExpanded = expandedIndices.has(realIndex);
          const shouldTruncate = userText.length > 500;

          return (
            <div
              key={realIndex}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white"
            >
              {/* Entry Number Header */}
              <div className="bg-gray-200 px-4 py-2 flex justify-between items-center border-b border-gray-300">
                <span className="font-semibold text-gray-800">
                  # {realIndex + 1}
                </span>
                <span className="text-sm text-gray-600">
                  Entry {realIndex + 1} of {entries.length}
                </span>
              </div>

              {/* Prompt Block */}
              <div className="bg-blue-50 px-4 py-2 border-b border-gray-300">
                <span className="font-semibold text-blue-800">🧑‍💼 Prompt</span>
              </div>
              <pre className="px-4 py-3 whitespace-pre-wrap text-gray-800 max-h-64 overflow-y-auto bg-white">
                {isExpanded || !shouldTruncate
                  ? userText
                  : userText.slice(0, 500) + "..."}
              </pre>
              {shouldTruncate && (
                <div className="px-4 pb-2">
                  <button
                    onClick={() => toggleExpand(realIndex)}
                    className="text-blue-600 text-sm mt-1"
                  >
                    {isExpanded ? "▲ Show Less" : "▼ Show More"}
                  </button>
                </div>
              )}

              {/* Response Block */}
              <div className="bg-green-50 px-4 py-2 border-t border-gray-300">
                <span className="font-semibold text-green-800">
                  🤖 Assistant
                </span>
              </div>
              <pre className="px-4 py-3 whitespace-pre-wrap text-gray-800 max-h-64 overflow-y-auto bg-white">
                {assistantText}
              </pre>

              <div className="px-4 py-2 border-t flex justify-end bg-gray-50">
                <button
                  onClick={() => {
                    localStorage.setItem("editData", JSON.stringify(entry));
                    localStorage.setItem("editIndex", realIndex);
                    window.location.href = "/";
                  }}
                  className="bg-yellow-400 text-gray-800 px-4 py-2 rounded hover:bg-yellow-500 text-sm"
                >
                  ✏️ Edit This Entry
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          ◀ Prev
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
