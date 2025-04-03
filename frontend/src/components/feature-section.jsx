import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, ImageIcon, AudioLines, Zap, Shield, Clock } from "lucide-react"
import SpotlightCard from "./ui/spotlightcard"

export default function FeatureSection() {
  return (
    <section className="container py-8 md:py-24 mt-10 bg-background border-4 rounded-4xl">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">Why Choose Our Comparison Tool?</h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl mx-auto">
            Our platform offers powerful features to make media comparison easy, accurate, and efficient.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
 
        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
          <Card >
            <CardHeader className="pb-2 p-4 md:p-6">
              <Zap className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-primary" />
              <CardTitle className="text-lg md:text-xl">Fast Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <CardDescription className="text-xs md:text-sm">
                Compare any media type instantly with our high-performance comparison engine.
              </CardDescription>
            </CardContent>
          </Card>
</SpotlightCard>

          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
          <Card>

            <CardHeader className="pb-2 p-4 md:p-6">
              <Shield className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-primary" />
              <CardTitle className="text-lg md:text-xl">Secure Uploads</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <CardDescription className="text-xs md:text-sm">
                Your files are encrypted and securely stored. We never share your data with third parties.
              </CardDescription>
            </CardContent>
          </Card>
</SpotlightCard>

<SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">

          <Card>
            <CardHeader className="pb-2 p-4 md:p-6">
              <Clock className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-primary" />
              <CardTitle className="text-lg md:text-xl">Time-saving</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <CardDescription className="text-xs md:text-sm">
                Save hours of manual comparison with our intuitive side-by-side interface.
              </CardDescription>
            </CardContent>
          </Card>
</SpotlightCard>
<SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">

          <Card>
            <CardHeader className="pb-2 p-4 md:p-6">
              <Video className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-primary" />
              <CardTitle className="text-lg md:text-xl">Video Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <CardDescription className="text-xs md:text-sm">
                Compare videos frame by frame with synchronized playback and detailed analysis.
              </CardDescription>
            </CardContent>
          </Card>
</SpotlightCard>

<SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">

          <Card>
            <CardHeader className="pb-2 p-4 md:p-6">
              <AudioLines className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-primary" />
              <CardTitle className="text-lg md:text-xl">Audio Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <CardDescription className="text-xs md:text-sm">
                Compare audio files with waveform visualization and frequency analysis tools.
              </CardDescription>
            </CardContent>
          </Card>
</SpotlightCard> 

<SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">

          <Card>
            <CardHeader className="pb-2 p-4 md:p-6">
              <ImageIcon className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-primary" />
              <CardTitle className="text-lg md:text-xl">Image Diff</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <CardDescription className="text-xs md:text-sm">
                Highlight differences between images with pixel-perfect comparison tools.
              </CardDescription>
            </CardContent>
          </Card>
</SpotlightCard>
        </div>
      </div>
    </section>
  )
}