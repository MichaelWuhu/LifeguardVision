import Link from "next/link"
import { WavyWater } from "@/components/wavy-water"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden select-none caret-transparent">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-200 via-blue-400 to-blue-600 -z-10"/>
      {/* Navigation bar */}
      <header className="fixed top-0 left-0 right-0 w-full bg-white/80 z-50">
        <div className="w-full bg-white relative z-10">
          <nav className="container mx-auto flex items-center justify-between">

            <div className="flex items-center gap-2">
              <Link
                href="#home-page"
                className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
                <div className="bg-white rounded-full p-2">
                  <Image src="/logo.svg" alt="Lifeguard Vision" className="object-contain" width={40} height={40}/>
                </div>
                <h1 className="text-xl font-serif italic font-bold text-black">
                  Lifeguard Vision
                </h1>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-30">
              <Link href="#who-we-help" className="text-gray-800 hover:underline font-medium">
                Who We Help
              </Link>
              <Link href="#how-it-works" className="text-gray-800 hover:underline font-medium">
                How It Works
              </Link>
              <Link href="#about-us" className="text-gray-800 hover:underline font-medium">
                About Us
              </Link>
            </div>

            <Link
              href="/cameraview"
              className="border-1 border-black bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md font-medium transition-colors">
              Try it now →
            </Link>
          </nav>
      

            {/* Wavy water line with floating element */}
            <div className="relative w-full mt-5">
              <WavyWater />
            </div>
          </div>
        </header>

    {/* Content area */}
    <div className="container mx-auto flex-1 px-4 py-12 mt-30">
      <div className="max-w-5xl mx-auto text-center">
        <div className="container mx-auto flex-1 px-4 py-12">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-white">
              Welcome to Lifeguard Vision
            </span>
          </h2>

        <div className="relative h-1 bg-white/50 rounded-full mx-auto mb-1 overflow-hidden">
          <div className="absolute inset-0 bg-white"></div>
          </div>
        </div>

        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-1 leading-relaxed">
        Leveraging artificial intelligence to assist lifeguards in rapidly identifying potential drowning incidents and alerting emergency services before the situation escalates.        </p>
      </div>
    </div>
    
    <div className="container mx-auto px-4 py-15 mt-30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Who We Help</h2>
      </div>

      <div className="relative w-40 h-1 bg-white/50 rounded-full mx-auto mb-1 overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
      </div>

      <p className="text-lg md:text-xl text-white/90 mx-auto mb-1 leading-relaxed text-center mt-4">
      Drowning is a leading cause of unintentional death globally, claiming over 372,000 lives each year, with young children 
      being especially vulnerable—drowning is the top cause of accidental death for children aged 1 to 4. In the U.S. alone, an 
      average of 10 people drown daily, and thousands more suffer severe, often life-altering injuries. Most incidents occur in 
      residential pools, often within minutes and without warning, even with supervision present. With many victims going unnoticed 
      until it's too late, there's a clear need for AI-powered systems that can detect drowning in real time and automatically alert 
      EMS—ensuring a faster, life-saving response when every second counts.
      </p>
    </div>
    
    </main>
  )
}
