import Link from "next/link"
import { WavyWater } from "@/components/wavy-water"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-blue-500 -z-10" />
      <div className="w-full bg-white shadow-md relative z-10">
      {/* Navigation bar */}
      <header className="w-full p-4">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full p-1">
                <Image src="/logo.svg" alt="Lifeguard Vision" className="object-contain" width={40} height={40}></Image>
            </div>
            <h1 className="text-xl font-serif italic font-bold">Lifeguard Vision</h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-gray-800 hover:underline font-medium">
              How It Works
            </Link>
            <Link href="#about-us" className="text-gray-800 hover:underline font-medium">
              About Us
            </Link>
          </div>

          <Link
            href="/cameraview"
            className="border-1 border-black bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md font-medium transition-colors"
          >
            Try it now →
          </Link>
        </nav>
      </header>
    

      {/* Wavy water line with floating element */}
      <div className="relative w-full mt-5">
        <WavyWater />
      </div>
    </div>

    {/* Content area */}
        <div className="container mx-auto flex-1 px-4 py-12">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-white">
              Welcome to Lifeguard Vision
            </span>
          </h2>
        <div className="relative h-1 bg-white/50 rounded-full mx-auto mb-10 overflow-hidden">
          <div className="absolute inset-0 bg-white"></div>
          </div>
        </div>
      
    </main>
  )
}
