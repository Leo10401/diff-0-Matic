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
import FolderComparison from "@/app/Folders/page"
import Docs from "@/app/docs/page"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/videos`

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
    <div className="grid grid-cols-1 gap-4 md:gap-6 px-2 sm:px-0">
      {/* Content card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {type === "video" && (
            <VideoCompare />
          )}
          {type === "folder" && (
            <FolderComparison />
          )}
          {type === "docs" && (
            <Docs/>
          )}
          {type === "audio" && (
            <AudioDiffChecker/>
          )}
          {type === "image" && (
            <ImageCompare/>
          )}
          {type === "text" && (
            <TextComparison/>
          )}
        </CardContent>
      </Card>
    </div>
  )
}