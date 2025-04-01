"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"
import axios from "axios"

const API_URL = "http://localhost:5000/api/videos"

export default function VideoCompare() {
  const [leftVideo, setLeftVideo] = useState(null)
  const [rightVideo, setRightVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [diffFrames, setDiffFrames] = useState([])
  const [error, setError] = useState("")

  const handleFileUpload = (side, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (side === "left") {
        setLeftVideo(file)
      } else {
        setRightVideo(file)
      }
    }
  }

  const handleCompare = async () => {
    if (!leftVideo || !rightVideo) {
      setError("Please select two videos.")
      return
    }

    setLoading(true)
    setError("")
    setDiffFrames([])

    try {
      const formData = new FormData()
      formData.append("video1", leftVideo)
      formData.append("video2", rightVideo)

      const uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const compareResponse = await axios.post(`${API_URL}/compare`, {
        videos: uploadResponse.data.videos,
      })

      setDiffFrames(compareResponse.data.timestampData || [])
    } catch (err) {
      setError("Error comparing videos: " + (err.response?.data?.error || err.message))
    }

    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Video */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="font-medium">Video 1</h3>
          </div>
          <div className="aspect-video  relative flex flex-col items-center justify-center p-6">
            {leftVideo ? (
              <video src={URL.createObjectURL(leftVideo)} className="w-full h-full object-contain" controls />
            ) : (
              <>
                <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
                <p className="text-center text-muted-foreground mb-4">Upload a video file to compare</p>
                <Button variant="outline" onClick={() => document.getElementById("left-video-upload")?.click()}>
                  Select Video
                </Button>
                <input
                  id="left-video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload("left", e)}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right Video */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="font-medium">Video 2</h3>
          </div>
          <div className="aspect-video  relative flex flex-col items-center justify-center p-6">
            {rightVideo ? (
              <video src={URL.createObjectURL(rightVideo)} className="w-full h-full object-contain" controls />
            ) : (
              <>
                <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
                <p className="text-center text-muted-foreground mb-4">Upload a video file to compare</p>
                <Button variant="outline" onClick={() => document.getElementById("right-video-upload")?.click()}>
                  Select Video
                </Button>
                <input
                  id="right-video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload("right", e)}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compare Button */}
      <div className="md:col-span-2 flex justify-center mt-4">
        <Button size="lg" onClick={handleCompare} disabled={loading || !leftVideo || !rightVideo}>
          {loading ? "Comparing..." : "Compare Videos"}
        </Button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center col-span-2">{error}</p>}

      {/* Differences Display */}
      {diffFrames.length > 0 && (
        
        <div className="md:col-span-2 w-full flex justify-center items-center max-w-4xl bg-gray-800 p-4 rounded shadow-lg overflow-scroll max-h-96">
          <h2 className="text-xl font-semibold mb-4">Differences Found ({diffFrames.length} frames):</h2>
          <div className="space-y-8">
            {diffFrames.map((item, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded">
                <h3 className="text-lg font-medium mb-3">Timestamp: {item.timestamp}</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex flex-col items-center">
                    <p className="mb-2">Video 1</p>
                    <img src={`http://localhost:5000${item.frame1}`} className="object-contain w-full h-64" />
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <p className="mb-2">Video 2</p>
                    <img src={`http://localhost:5000${item.frame2}`} className="object-contain w-full h-64" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}