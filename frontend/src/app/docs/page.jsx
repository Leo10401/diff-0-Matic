'use client';
import { useState, useRef } from "react";
import axios from "axios";
import DiffMatchPatch from "diff-match-patch";

export default function Docs() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffHtml, setDiffHtml] = useState("");
  const [diffStats, setDiffStats] = useState(null);
  const [ocrAnalysis, setOcrAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Refs for the file inputs
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);

  const handleFileChange = (e, fileNumber) => {
    const file = e.target.files[0];
    if (file) {
      if (fileNumber === 1) setFile1(file);
      else setFile2(file);
    }
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  };
  
  const handleDrop = (e, fileNumber) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (fileNumber === 1) setFile1(file);
      else setFile2(file);
    }
  };

  const handleUpload = async () => {
    if (!file1 || !file2) {
      setError("Please select two documents.");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("files", file1);
    formData.append("files", file2);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/docs/compare`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setText1(res.data.text1);
      setText2(res.data.text2);
      highlightDifferences(res.data.text1, res.data.text2);
      
      // Set statistics if available
      if (res.data.stats) {
        setDiffStats(res.data.stats);
      }
      
      // Set OCR analysis if available
      if (res.data.ocrAnalysis) {
        setOcrAnalysis(res.data.ocrAnalysis);
      } else {
        setOcrAnalysis(null);
      }
      
    } catch (err) {
      console.error("Error:", err);
      setError("Error comparing documents");
    }
    setLoading(false);
  };

  const highlightDifferences = (t1, t2) => {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(t1, t2);
    dmp.diff_cleanupSemantic(diffs);

    const html = diffs
      .map(([op, data]) => {
        if (op === 1) return `<span class="bg-green-200 px-1">${data}</span>`; // Added
        if (op === -1) return `<span class="bg-red-200 px-1">${data}</span>`; // Removed
        return `<span>${data}</span>`; // No change
      })
      .join("");

    setDiffHtml(html);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-8">Compare Two Documents</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-6 w-full max-w-5xl">
        {/* First Document Upload Area */}
        <div 
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50"
          onClick={() => fileInput1Ref.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 1)}
        >
          <div className="bg-gray-200 rounded-lg p-2 mb-3">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Drop document here</h3>
          <p className="text-sm text-gray-500 mb-3">doc, docx, pdf, etc</p>
          
          <input
            ref={fileInput1Ref}
            type="file"
            className="hidden"
            accept=".docx,.pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 1)}
          />
          
          <button className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors">
            <span className="mr-1">Browse</span>
          </button>
          
          {file1 && (
            <div className="mt-3 text-sm text-green-600 font-medium">
              {file1.name}
            </div>
          )}
        </div>
        
        {/* Second Document Upload Area */}
        <div 
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50"
          onClick={() => fileInput2Ref.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 2)}
        >
          <div className="bg-gray-200 rounded-lg p-2 mb-3">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Drop document here</h3>
          <p className="text-sm text-gray-500 mb-3">doc, docx, pdf, etc</p>
          
          <input
            ref={fileInput2Ref}
            type="file"
            className="hidden"
            accept=".docx,.pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 2)}
          />
          
          <button className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors">
            <span className="mr-1">Browse</span>
          </button>
          
          {file2 && (
            <div className="mt-3 text-sm text-green-600 font-medium">
              {file2.name}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        disabled={loading || !file1 || !file2}
      >
        {loading ? "Comparing..." : "Compare Documents"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {diffStats && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow w-full max-w-5xl">
          <h2 className="font-bold mb-2">Difference Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Different Content</p>
              <p className="text-xl font-semibold">{diffStats.diffPercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Added Characters</p>
              <p className="text-xl font-semibold text-green-600">{diffStats.addedChars}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Removed Characters</p>
              <p className="text-xl font-semibold text-red-600">{diffStats.removedChars}</p>
            </div>
          </div>
        </div>
      )}

      {ocrAnalysis && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow w-full max-w-5xl">
          <h2 className="font-bold mb-2">OCR Analysis</h2>
          
          <div className="mb-4">
            <h3 className="text-md font-semibold">OCR Confidence</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Document 1</p>
                <p className="font-medium">{ocrAnalysis.overallConfidence1.toFixed(1)}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" 
                       style={{ width: `${ocrAnalysis.overallConfidence1}%` }}></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Document 2</p>
                <p className="font-medium">{ocrAnalysis.overallConfidence2.toFixed(1)}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" 
                       style={{ width: `${ocrAnalysis.overallConfidence2}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {ocrAnalysis.potentialMisreads.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Potential OCR Misreads</h3>
              <div className="max-h-40 overflow-y-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-600">Doc 1</th>
                      <th className="text-left text-sm font-medium text-gray-600">Doc 2</th>
                      <th className="text-left text-sm font-medium text-gray-600">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrAnalysis.potentialMisreads.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-1">{item.word1}</td>
                        <td className="py-1">{item.word2}</td>
                        <td className="py-1 text-sm">{item.editDistance} character(s)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {ocrAnalysis.lowConfidenceWords1.length > 0 && (
            <div className="mb-2">
              <h3 className="text-md font-semibold mb-1">Low Confidence Words (Doc 1)</h3>
              <div className="text-sm bg-gray-50 p-2 rounded max-h-24 overflow-y-auto">
                {ocrAnalysis.lowConfidenceWords1.map((word, idx) => (
                  <span key={idx} className="inline-block bg-yellow-100 mr-1 mb-1 px-1 rounded" 
                        title={`Confidence: ${word.confidence.toFixed(1)}%`}>
                    {word.text}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {ocrAnalysis.lowConfidenceWords2.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-1">Low Confidence Words (Doc 2)</h3>
              <div className="text-sm bg-gray-50 p-2 rounded max-h-24 overflow-y-auto">
                {ocrAnalysis.lowConfidenceWords2.map((word, idx) => (
                  <span key={idx} className="inline-block bg-yellow-100 mr-1 mb-1 px-1 rounded" 
                        title={`Confidence: ${word.confidence.toFixed(1)}%`}>
                    {word.text}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {text1 && text2 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Original Text</h2>
            <p className="whitespace-pre-wrap text-sm">{text1}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Differences</h2>
            <p className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: diffHtml }}></p>
          </div>
        </div>
      )}
    </div>
  );
}