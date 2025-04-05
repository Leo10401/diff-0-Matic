'use client';
import { Button } from "@/components/ui/button";
import { OrbitControls, Stage, useGLTF, useAnimations } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import Spline from '@splinetool/react-spline';
import Link from "next/link";
import RotatingText from "./ui/rotingtxt";

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
  const [starCount, setStarCount] = useState(null);

  useEffect(() => {
    // Fetch the star count from GitHub API
    async function fetchStarCount() {
      try {
        const response = await fetch("https://api.github.com/repos/Leo10401/diff-0-Matic"); // Replace 'owner/repo' with your GitHub repo
        const data = await response.json();
        setStarCount(data.stargazers_count);
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      }
    }

    fetchStarCount();
  }, []);

  return (
    <section className="w-full md:py-12 hidden sm:block">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2 grid-cols-6">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none flex items-center flex-wrap">
                <span className="mr-2">Compare</span>
                <RotatingText
                  texts={["Videos", "Audio", "Images", "Text", "Folders", "Documents"]}
                  mainClassName="w-fit p-6 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 rounded-lg"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                />
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
          <div className="relative w-auto z-5 md:h-[500px] lg:h-[300px] xl:h-[500px] xl-h-fill rounded-4xl 2xl:h-[600px]">
            <Spline className="rounded-4xl" scene="https://prod.spline.design/3uDK7WyDw-IrfcwN/scene.splinecode" />
            <div className="absolute bottom-5 right-6 h-10 rounded-2xl bg-[#111111] z-50">
              <Link
                href="https://github.com/Leo10401/diff-0-Matic"
                className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
              >
                <span
                  className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
                ></span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 438.549 438.549">
                    <path
                      d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                    ></path>
                  </svg>
                  <span className="ml-1 text-white">Star on GitHub</span>
                </div>
                <div className="ml-2 flex items-center gap-1 text-sm md:flex">
                  <svg
                    className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
                    data-slot="icon"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  <span
                    className="inline-block tabular-nums tracking-wider font-display font-medium text-white"
                  >{starCount}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}