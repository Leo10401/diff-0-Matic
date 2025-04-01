import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Video, ImageIcon, FileText, AudioLines, ArrowRight } from "lucide-react"
import MediaCompare from "@/components/media-compare"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center space-x-2">
            <ArrowRight className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">CompareMedia</span>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" className="text-sm font-medium">
              Features
            </Button>
            <Button variant="ghost" className="text-sm font-medium">
              Pricing
            </Button>
            <Button variant="ghost" className="text-sm font-medium">
              About
            </Button>
            <Button>Get Started</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        <section className="container py-12 md:py-24">
          <div className="mx-auto max-w-5xl">
            <Tabs defaultValue="video" className="w-full">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Compare Any Media Type</h2>
                <p className="text-muted-foreground mb-8 text-center max-w-3xl">
                  Upload and compare videos, audio, images, or text side by side to spot differences and make better
                  decisions.
                </p>
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-xl">
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>Video</span>
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="flex items-center gap-2">
                    <AudioLines className="h-4 w-4" />
                    <span>Audio</span>
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Image</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Text</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="video" className="mt-0">
                <MediaCompare type="video" />
              </TabsContent>

              <TabsContent value="audio" className="mt-0">
                <MediaCompare type="audio" />
              </TabsContent>

              <TabsContent value="image" className="mt-0">
                <MediaCompare type="image" />
              </TabsContent>

              <TabsContent value="text" className="mt-0">
                <MediaCompare type="text" />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <FeatureSection />

        <section className="bg-muted py-12 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to start comparing?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of users who make better decisions with our comparison tools.
              </p>
              <Button size="lg" className="mx-auto">
                Get Started for Free
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <ArrowRight className="h-5 w-5" />
            <span className="font-semibold">CompareMedia</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CompareMedia. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">
              Privacy
            </Button>
            <Button variant="ghost" size="sm">
              Terms
            </Button>
            <Button variant="ghost" size="sm">
              Contact
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

