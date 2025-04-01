import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Compare Media Side by Side
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Upload videos, audio, images, or text and compare them instantly. Spot differences, make better
                decisions, and save time.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg">Start Comparing</Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[600px] aspect-video overflow-hidden rounded-xl border bg-background shadow-xl">
              <Image
                src="/placeholder.svg?height=450&width=800"
                width={800}
                height={450}
                alt="Media comparison interface showing side-by-side video comparison"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 flex items-end p-6">
                <p className="text-lg font-medium text-white">Powerful comparison tools for all media types</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

