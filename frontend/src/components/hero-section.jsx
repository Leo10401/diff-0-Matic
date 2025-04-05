'use client';
import { Button } from "@/components/ui/button";
import { OrbitControls, Stage, useGLTF, useAnimations } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import Spline from '@splinetool/react-spline';


function Model() {
  const group = useRef();
  // Load both the scene and animations
  const { scene, animations } = useGLTF("/smol.glb", true);
  // Set up animations
  const { actions, names } = useAnimations(animations, group);
  
  // Play the first animation automatically when component mounts
  useEffect(() => {
    if (names.length > 0) {
      // Play the first animation in the list
      actions[names[0]]?.reset().play();
    }
  }, [actions, names]);

  return (
    <group ref={group}>
      <primitive object={scene} scale={1} />
    </group>
  );
}

export default function HeroSection({ onStartComparing }) {
  return (
    <section className="w-full py-12 md:py-24  bg-muted hidden sm:block ">
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
              <Button size="lg" onClick={onStartComparing}>Start Comparing</Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="">
            <div className="relative w-auto z-5 md:h-[500px] lg:h-[300px] xl:h-[500px] xl-h-fill 2xl:h-[600px] overflow-hidden">
              <div className="absolute inset-0">
                <Spline scene="https://prod.spline.design/3uDK7WyDw-IrfcwN/scene.splinecode" />
              </div>
              <div className="absolute bottom-10 right-0 w-24 h-64 "></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}