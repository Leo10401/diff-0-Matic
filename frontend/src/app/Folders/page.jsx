'use client';
import React, { useState } from "react";
import axios from "axios";

const FolderComparison = () => {
  const [folder1, setFolder1] = useState(null);
  const [folder2, setFolder2] = useState(null);
  const [zip1, setZip1] = useState(null);
  const [zip2, setZip2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Handle folder input change
  const handleFolder1Change = (e) => {
    setFolder1(e.target.files[0]);
  };

  const handleFolder2Change = (e) => {
    setFolder2(e.target.files[0]);
  };

  // Handle ZIP file input change
  const handleZip1Change = (e) => {
    setZip1(e.target.files[0]);
  };

  const handleZip2Change = (e) => {
    setZip2(e.target.files[0]);
  };

  // Form submission handler for folders
  const compareFolders = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("folders", folder1);
    formData.append("folders", folder2);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/folder/compare/folders`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResults(res.data);
      setError(null);
    } catch (err) {
      setError("Error comparing folders: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler for ZIP files
  const compareZipFiles = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("zips", zip1);
    formData.append("zips", zip2);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/folder/compare/zip`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResults(res.data);
      setError(null);
    } catch (err) {
      setError("Error comparing ZIP files: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + 'B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + 'KB';
    else return (bytes / 1048576).toFixed(2) + 'MB';
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">File Comparison Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold mb-3">ZIP File Comparison</h2>
            <form onSubmit={compareZipFiles}>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block mb-1">First ZIP:</label>
                  <input 
                    type="file" 
                    onChange={handleZip1Change} 
                    accept=".zip"
                    className="w-full border p-2 rounded" 
                    required 
                  />
                </div>
                <div>
                  <label className="block mb-1">Second ZIP:</label>
                  <input 
                    type="file" 
                    onChange={handleZip2Change} 
                    accept=".zip"
                    className="w-full border p-2 rounded" 
                    required 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Comparing...' : 'Compare ZIP Files'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {results && (
        <div className="border rounded">
          <div className="flex justify-between bg-gray-100 p-3 border-b">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{results.source1.name}</span>
              <span className="text-gray-500 text-sm">{formatFileSize(results.source1.size)}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{results.source2.name}</span>
              <span className="text-gray-500 text-sm">{formatFileSize(results.source2.size)}</span>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 border-b">
            <div className="flex space-x-6">
              {results.removed.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span>{results.removed.length} removed {results.removed.length === 1 ? 'file' : 'files'}</span>
                </div>
              )}
              {results.added.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>{results.added.length} added {results.added.length === 1 ? 'file' : 'files'}</span>
                </div>
              )}
              {results.changed.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span>{results.changed.length} changed {results.changed.length === 1 ? 'file' : 'files'}</span>
                </div>
              )}
              {results.unchanged.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                  <span>{results.unchanged.length} {results.unchanged.length === 1 ? 'file' : 'files'} unchanged</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left w-1/3">File</th>
                  <th className="px-4 py-2 text-left">Last edited</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left w-1/3">File</th>
                  <th className="px-4 py-2 text-left">Last edited</th>
                  <th className="px-4 py-2 text-left">Size</th>
                </tr>
              </thead>
              <tbody>
                {/* Render file comparison rows */}
                {[...results.unchanged, ...results.changed, ...results.removed, ...results.added].map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-t ${
                      results.removed.includes(item) ? 'bg-red-50' : 
                      results.added.includes(item) ? 'bg-green-50' : 
                      results.changed.includes(item) ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* Left side (source 1) */}
                    {!results.added.includes(item) ? (
                      <>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <span className={results.removed.includes(item) ? 'text-red-600' : ''}>
                              {item.file}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {formatDate(item.lastModified1)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {formatFileSize(item.size1)}
                        </td>
                      </>
                    ) : (
                      <td colSpan="3" className="px-4 py-2"></td>
                    )}
                    
                    {/* Right side (source 2) */}
                    {!results.removed.includes(item) ? (
                      <>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <span className={results.added.includes(item) ? 'text-green-600' : ''}>
                              {item.file}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {formatDate(item.lastModified2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {formatFileSize(item.size2)}
                        </td>
                      </>
                    ) : (
                      <td colSpan="3" className="px-4 py-2"></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderComparison;