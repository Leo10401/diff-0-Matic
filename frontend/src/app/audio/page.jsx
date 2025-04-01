"use client";
import { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

export default function AudioDiffChecker() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const wavesurfer1Ref = useRef(null);
  const wavesurfer2Ref = useRef(null);

  useEffect(() => {
    if (!wavesurfer1Ref.current) {
      wavesurfer1Ref.current = WaveSurfer.create({
        container: "#waveform1",
        waveColor: "#4CAF50",
        progressColor: "#2E7D32",
        barWidth: 3,
        barRadius: 2,
        cursorWidth: 1,
        cursorColor: "#FF0000",
        responsive: true,
        plugins: [RegionsPlugin.create()],
      });
    }

    if (!wavesurfer2Ref.current) {
      wavesurfer2Ref.current = WaveSurfer.create({
        container: "#waveform2",
        waveColor: "#2196F3",
        progressColor: "#0D47A1",
        barWidth: 3,
        barRadius: 2,
        cursorWidth: 1,
        cursorColor: "#FF0000",
        responsive: true,
        plugins: [RegionsPlugin.create()],
      });
    }
  }, []);

  // Function to load audio files
  const handleFileUpload = (event, setFile, wavesurfer) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      wavesurfer.load(url);
    }
  };

  // Sync play/pause for both audios
  const syncPlayPause = () => {
    if (wavesurfer1Ref.current.isPlaying()) {
      wavesurfer1Ref.current.pause();
      wavesurfer2Ref.current.pause();
    } else {
      wavesurfer1Ref.current.play();
      wavesurfer2Ref.current.play();
    }
  };

  // Function to extract waveform data
  const extractAudioData = async (file) => {
    return new Promise((resolve) => {
      const context = new AudioContext();
      const reader = new FileReader();

      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        const rawData = audioBuffer.getChannelData(0);
        resolve(rawData);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  // Function to compare waveform data
  const compareAudio = async () => {
    if (!file1 || !file2) {
      alert("Please upload both audio files.");
      return;
    }

    const audioData1 = await extractAudioData(file1);
    const audioData2 = await extractAudioData(file2);

    const sampleRate = 44100;
    const segmentSize = 0.1 * sampleRate; // 100ms segments

    let differences = [];

    for (let i = 0; i < Math.min(audioData1.length, audioData2.length); i += segmentSize) {
      const segment1 = audioData1.slice(i, i + segmentSize);
      const segment2 = audioData2.slice(i, i + segmentSize);

      const diff = segment1.map((value, index) => Math.abs(value - (segment2[index] || 0)));

      const averageDiff = diff.reduce((acc, val) => acc + val, 0) / diff.length;

      if (averageDiff > 0.01) {
        differences.push(i / sampleRate); // Convert sample index to time
      }
    }

    if (differences.length === 0) {
      alert("No significant differences found.");
      return;
    }

    const regionPlugin1 = wavesurfer1Ref.current.registerPlugin(
      RegionsPlugin.create()
    );
    const regionPlugin2 = wavesurfer2Ref.current.registerPlugin(
      RegionsPlugin.create()
    );

    // Highlight differences in red
    differences.forEach((time) => {
      regionPlugin1.addRegion({
        start: time,
        end: time + 0.2,
        color: "rgba(255, 0, 0, 0.5)",
      });

      regionPlugin2.addRegion({
        start: time,
        end: time + 0.2,
        color: "rgba(255, 0, 0, 0.5)",
      });
    });

    alert("Differences highlighted in red.");
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Audio Diff Checker</h1>

      <div className="flex gap-4">
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => handleFileUpload(e, setFile1, wavesurfer1Ref.current)}
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => handleFileUpload(e, setFile2, wavesurfer2Ref.current)}
        />
      </div>

      <div id="waveform1" className="w-full h-24 bg-gray-200"></div>
      <div id="waveform2" className="w-full h-24 bg-gray-300"></div>

      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={syncPlayPause}>
          Play/Pause
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={compareAudio}>
          Compare Audio
        </button>
      </div>
    </div>
  );
}
