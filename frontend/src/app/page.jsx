'use client';
import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, ImageIcon, FileText, AudioLines, ArrowRight, FoldersIcon, FileIcon } from "lucide-react";
import MediaCompare from "@/components/media-compare";
import HeroSection from "@/components/hero-section";
import FeatureSection from "@/components/feature-section";

export default function Home() {
  const compareSectionRef = useRef(null);

  const handleScrollToCompare = () => {
    compareSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col inset-0 ">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center space-x-2 ">
            <ArrowRight className="h-6 w-6" />
            <span className="font-bold">CompareMedia</span>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-2 hidden sm:block">
            <Button variant="ghost" className="text-xs sm:text-sm font-medium p-2 sm:p-4">
              Features
            </Button>
            <Button variant="ghost" className="text-xs sm:text-sm font-medium p-2 sm:p-4">
              Pricing
            </Button>
            <Button variant="ghost" className="text-xs sm:text-sm font-medium p-2 sm:p-4">
              About
            </Button>
            <Button className="text-xs sm:text-sm">Get Started</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 z-5">
        {/* Small screen alternative header for mobile */}
        <section className="w-full py-8 bg-muted sm:hidden">
          <div className="container px-4 ">
            <div className="flex flex-col items-center text-center space-y-4 ">
              <h1 className="text-2xl font-bold tracking-tighter ">
                Compare Media Side by Side
              </h1>
              <p className="text-sm text-muted-foreground">
                Upload and compare media instantly
              </p>
              <Button size="sm" onClick={handleScrollToCompare}>Start Comparing</Button>
            </div>
          </div>
        </section>
      
        <HeroSection onStartComparing={handleScrollToCompare} />

        <section
          ref={compareSectionRef}
          className="container py-8 md:py-24 bg-[#22333b] border-4 rounded-4xl"
        >
          <div className="mx-auto max-w-5xl">
            <Tabs defaultValue="video" className="w-full">
              <div className="flex flex-col items-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4 text-center z-10">
                  Compare Any Media Type
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground mb-6 md:mb-8 text-center max-w-3xl px-2">
                  Upload and compare videos, audio, images, or text side by side to spot differences and make better
                  decisions.
                </p>
                <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full max-w-xl ">
                  <TabsTrigger value="video" className="flex items-center gap-1 text-xs md:text-sm">
                    <Video className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Video</span>
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="flex items-center gap-1 text-xs md:text-sm">
                    <AudioLines className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Audio</span>
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-1 text-xs md:text-sm">
                    <ImageIcon className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Image</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-1 text-xs md:text-sm">
                    <FileText className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="folder" className="flex items-center gap-1 text-xs md:text-sm">
                    <FoldersIcon className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Folders</span>
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="flex items-center gap-1 text-xs md:text-sm">
                    <FileIcon className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Documents</span>
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
              <TabsContent value="folder" className="mt-0">
                <MediaCompare type="folder" />
              </TabsContent>
              <TabsContent value="docs" className="mt-0">
                <MediaCompare type="docs" />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <FeatureSection />

        <section className="bg-muted py-8 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center px-4">
              <h2 className="text-xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">Ready to start comparing?</h2>
              <p className="text-xs md:text-sm text-muted-foreground mb-6 md:mb-8 z-10">
                Join thousands of users who make better decisions with our comparison tools.
              </p>
              <Button size="sm" className="mx-auto md:hidden z-10">
                Get Started Free
              </Button>
              <Button size="lg" className="mx-auto hidden md:flex">
                Get Started for Free
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-4 md:py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 z-10" />
            <span className="text-sm md:text-base font-semibold z-10">CompareMedia</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground z-10">
            &copy; {new Date().getFullYear()} CompareMedia. All rights reserved.
          </p>
          <div className="flex gap-2 md:gap-4 z-10">
            <Button variant="ghost" size="sm" className="text-xs">
              Privacy
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Terms
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Contact
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}