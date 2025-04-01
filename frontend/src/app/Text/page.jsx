'use client';
import { useState } from "react";
import axios from "axios";

export default function TextComparison() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffs, setDiffs] = useState([]);

  const compareTexts = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/text/compare-text", { text1, text2 });
      setDiffs(response.data.differences);
    } catch (error) {
      console.error("Error comparing texts:", error);
    }
  };

  const handleReset = () => {
    setText1("");
    setText2("");
    setDiffs([]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-screen bg-[#ffffff]">
      <h1 className="text-2xl font-bold text-fuchsia-500">Compare Texts</h1>
      <p className="text-gray-600 mb-4">Enter two texts to compare</p>
      <div className="w-full max-w-2xl flex justify-evenly gap-8 text-amber-800">
        <textarea
          className="border p-2 w-lg"
          rows="5"
          placeholder="Enter first text here..."
          value={text1}
          onChange={(e) => setText1(e.target.value)}
        />
        <textarea
          className="border p-2 w-lg"
          rows="5"
          placeholder="Enter second text here..."
          value={text2}
          onChange={(e) => setText2(e.target.value)}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <button
          className="border px-4 py-2 bg-blue-500" 
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="bg-black text-white px-4 py-2"
          onClick={compareTexts}
        >
          Compare
        </button>
      </div>
      <div className="mt-6 p-4  w-full max-w-2xl text-center bg-black">
        <h3 className="text-lg font-semibold">Differences:</h3>
        <p>
          {diffs.map((part, index) => (
            <span key={index} style={{ backgroundColor: part.added ? "lightgreen" : part.removed ? "salmon" : "transparent" }}>
              {part.value}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}