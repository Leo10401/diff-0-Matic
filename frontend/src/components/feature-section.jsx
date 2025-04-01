import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, ImageIcon, AudioLines, Zap, Shield, Clock } from "lucide-react"

export default function FeatureSection() {
  return (
    <section className="container py-12 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose Our Comparison Tool?</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Our platform offers powerful features to make media comparison easy, accurate, and efficient.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <Zap className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Fast Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Compare any media type instantly with our high-performance comparison engine.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Shield className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Secure Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your files are encrypted and securely stored. We never share your data with third parties.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Clock className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Time-saving</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Save hours of manual comparison with our intuitive side-by-side interface.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Video className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Video Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Compare videos frame by frame with synchronized playback and detailed analysis.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <AudioLines className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Audio Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Compare audio files with waveform visualization and frequency analysis tools.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <ImageIcon className="h-6 w-6 mb-2 text-primary" />
              <CardTitle>Image Diff</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Highlight differences between images with pixel-perfect comparison tools.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

