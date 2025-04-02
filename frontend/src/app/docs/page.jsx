'use client';
import { useState } from "react";
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

  const handleFileChange = (e, fileNumber) => {
    if (fileNumber === 1) setFile1(e.target.files[0]);
    else setFile2(e.target.files[0]);
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
      const res = await axios.post("http://localhost:5000/api/docs/compare", formData, {
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
      <h1 className="text-2xl font-bold mb-4">Compare Two Documents</h1>

      <div className="flex flex-col gap-4 mb-4">
        <div>
          <label className="block font-medium">Select First Document:</label>
          <input type="file" accept=".docx,.pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 1)} />
        </div>

        <div>
          <label className="block font-medium">Select Second Document:</label>
          <input type="file" accept=".docx,.pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 2)} />
        </div>
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Comparing..." : "Compare Documents"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {diffStats && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow w-full max-w-4xl">
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
        <div className="mt-4 bg-white p-4 rounded-lg shadow w-full max-w-4xl">
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
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