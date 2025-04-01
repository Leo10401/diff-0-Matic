"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Play, Pause, SkipForward, Volume2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import VideoCompare from "@/app/video/page"
import AudioDiffChecker from "@/app/audio/page"
import TextComparison from "@/app/Text/page"
import ImageCompare from "@/app/images/page"

const API_URL = "http://localhost:5000/api/videos"

export default function MediaCompare({ type }) {
  const [leftMedia, setLeftMedia] = useState(null)
  const [rightMedia, setRightMedia] = useState(null)
  const [leftText, setLeftText] = useState("")
  const [rightText, setRightText] = useState("")

  const handleFileUpload = (side, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)

      if (side === "left") {
        setLeftMedia(url)
      } else {
        setRightMedia(url)
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      {/* Left side */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">


          {type === "video" && (
            <VideoCompare />
          )}

          {type === "audio" && (
            <AudioDiffChecker/>
// <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            //   {leftMedia ? (
            //     <div className="w-full">
            //       <div className="flex items-center justify-center gap-2 mb-4">
            //         <Button size="icon" variant="outline">
            //           <Play className="h-4 w-4" />
            //         </Button>
            //         <Button size="icon" variant="outline">
            //           <Pause className="h-4 w-4" />
            //         </Button>
            //         <Button size="icon" variant="outline">
            //           <SkipForward className="h-4 w-4" />
            //         </Button>
            //         <Button size="icon" variant="outline">
            //           <Volume2 className="h-4 w-4" />
            //         </Button>
            //       </div>
            //       <div className="h-24 bg-muted rounded-md flex items-center justify-center">
            //         <div className="w-full px-4">
            //           <div className="w-full h-12 bg-primary/20 rounded-md relative">
            //             <div className="absolute inset-y-0 left-0 w-1/3 bg-primary/40 rounded-l-md"></div>
            //           </div>
            //         </div>
            //       </div>
            //       <audio src={leftMedia} className="hidden" controls />
            //     </div>
            //   ) : (
            //     <>
            //       <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
            //       <p className="text-center text-muted-foreground mb-4">Upload an audio file to compare</p>
            //       <Button variant="outline" onClick={() => document.getElementById("left-audio-upload")?.click()}>
            //         Select Audio
            //       </Button>
            //       <input
            //         id="left-audio-upload"
            //         type="file"
            //         accept="audio/*"
            //         className="hidden"
            //         onChange={(e) => handleFileUpload("left", e)}
            //       />
            //     </>
            //   )}
            // </div>
          )}

          {type === "image" && (
            <ImageCompare/>
          )}

          {type === "text" && (
            <TextComparison/>
// <div className="p-6">
            //   <Textarea
            //     placeholder="Enter or paste text here to compare..."
            //     className="min-h-[300px]"
            //     value={leftText}
            //     onChange={(e) => setLeftText(e.target.value)}
            //   />
            // </div>
          )}
        </CardContent>
      </Card>

      {/* Right side */}
      {/* <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="font-medium">File 2</h3>
          </div>

          {type === "video" && (
            <div className="aspect-video bg-black relative">
              {rightMedia ? (
                <video src={rightMedia} className="w-full h-full object-contain" controls />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <Upload className="h-10 w-10 mb-4 text-muted-foreground text-white" />
                  <p className="text-center text-muted-foreground mb-4 text-white">Upload a video file to compare</p>
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
                </div>
              )}
            </div>
          )}

          {type === "audio" && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
              {rightMedia ? (
                <div className="w-full">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Button size="icon" variant="outline">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                    <div className="w-full px-4">
                      <div className="w-full h-12 bg-primary/20 rounded-md relative">
                        <div className="absolute inset-y-0 left-0 w-2/3 bg-primary/40 rounded-l-md"></div>
                      </div>
                    </div>
                  </div>
                  <audio src={rightMedia} className="hidden" controls />
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
                  <p className="text-center text-muted-foreground mb-4">Upload an audio file to compare</p>
                  <Button variant="outline" onClick={() => document.getElementById("right-audio-upload")?.click()}>
                    Select Audio
                  </Button>
                  <input
                    id="right-audio-upload"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload("right", e)}
                  />
                </>
              )}
            </div>
          )}

          {type === "image" && (
            <div className="aspect-square bg-muted/30 relative">
              {rightMedia ? (
                <Image
                  src={rightMedia || "/placeholder.svg"}
                  alt="Right image for comparison"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
                  <p className="text-center text-muted-foreground mb-4">Upload an image to compare</p>
                  <Button variant="outline" onClick={() => document.getElementById("right-image-upload")?.click()}>
                    Select Image
                  </Button>
                  <input
                    id="right-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload("right", e)}
                  />
                </div>
              )}
            </div>
          )}

          {type === "text" && (
            <div className="p-6">
              <Textarea
                placeholder="Enter or paste text here to compare..."
                className="min-h-[300px]"
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card> */}

      {/* Compare button */}
      {/* <div className="md:col-span-2 flex justify-center mt-4">
        <Button size="lg" disabled={type === "text" ? !leftText || !rightText : !leftMedia || !rightMedia}>
          Compare {type === "video" ? "Videos" : type === "audio" ? "Audio" : type === "image" ? "Images" : "Text"}
        </Button>
      </div> */}
    </div>
  )
}

