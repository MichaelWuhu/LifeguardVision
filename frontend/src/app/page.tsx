import Link from "next/link"
import { WavyWater } from "@/components/wavy-water"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden select-none caret-transparent">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-200 to-blue-600 -z-10"/>
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
                <h1 className="text-xl font-serif italic font-bold text-gray-800">
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
              className="border-1 border-black bg-red-200 hover:bg-red-400 text-black px-4 py-2 rounded-md font-medium transition-colors">
              Use it now! →
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
    
    <div id="who-we-help" className="container mx-auto flex-1 px-4 py-12 mt-30">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Who We Help</h3>
      </div>

      <div className="relative w-40 h-1 bg-white/50 rounded-full mx-auto mb-1 overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
      </div>

      <p className="text-lg md:text-xl text-white/90 text-center leading-relaxed mt-10 px-4 max-w-3xl mx-auto mb-4">
        Drowning is a leading cause of unintentional death globally, claiming over 372,000 lives each year, with young children 
        being especially vulnerable—drowning is the top cause of accidental death for children aged 1 to 4. In the U.S. alone, an 
        average of 10 people drown daily, and thousands more suffer severe, often life-altering injuries. Most incidents occur in 
        residential pools, often within minutes and without warning, even with supervision present. With many victims going unnoticed 
        until it's too late, there's a clear need for an upgrade in surveillance that can detect drowning in real time and automatically alert 
        EMS—ensuring a faster, life-saving response when every second counts.
      </p>
    </div>

    <div id="how-it-works" className="container mx-auto flex-1 px-4 py-12 mt-30">
      <div className="max-w-4xl mx-auto">
        <h4 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">How it Works</h4>
      </div>

      <div className="relative w-40 h-1 bg-white/50 rounded-full mx-auto mb-1 overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
      </div>

      <div className="w-full flex justify-center">
        <div className="grid md:grid-cols-2 gap-8 text-white mt-10 max-w-2xl items-center">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl mb-4 text-center">🔍</div>
            <h5 className="text-xl font-semibold mb-2 text-center">AI Detection</h5>
            <p className="text-white/80 text-center">
              Our AI software will continuously monitor pool activity, detecting passive drowning victims in
              real-time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl mb-4 text-center">⚡</div>
            <h5 className="text-xl font-semibold mb-2 text-center">Instant Alerts</h5>
            <p className="text-white/80 text-center">
              When an unconscious person is detected in the pool, EMS (Emergency Medical Services) will receive an immediate alert.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div id="about-us" className="max-w-4xl mx-auto mt-50">
      <h6 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">About Us</h6>
    </div>

    <div className="relative w-40 h-1 bg-white/50 rounded-full mx-auto mb-1 overflow-hidden">
      <div className="absolute inset-0 bg-white"></div>
    </div>

    <div className="flex justify-center items-center mt-10">
      <div className="rounded-full p-2">
              <Image src="/Bromchaks_2025_Group_Photo.png" alt="Group Picture" className="object-contain" width={500} height={500}/>
      </div>
    </div>

    <div className="text-lg md:text-xl text-white/90 mx-auto mb-1 leading-relaxed text-center mt-10 max-w-2xl space-y-4 mt-10">
      <p>
        We are <strong>Bromchaks</strong>, a team of four students aspiring to pursue careers in computer science. From left to right in the photo above, our members are <strong>Jayden Nguyen</strong>, <strong>Brandon Tseng</strong>, <strong>Michael Wu</strong>, and <strong>Timothy Huang</strong>.
      </p>

      <p>
        This project was our submission to the <strong>2025 BroncoHacks</strong> hackathon.
      </p>

      <div className="text-sm md:text-base text-white/70 mt-4">
        <p><strong>Emails:</strong></p>
        <p>Jayden Nguyen — <a href="mailto:jayden.vinh.nguyen@gmail.com" className="underline hover:text-white">jayden.vinh.nguyen@gmail.com</a></p>
        <p>Brandon Tseng — <a href="mailto:valithan629@gmail.com" className="underline hover:text-white">valithan629@gmail.com</a></p>
        <p>Michael Wu — <a href="mailto:mwu250@gmail.com" className="underline hover:text-white">mwu250@gmail.com</a></p>
        <p>Timothy Huang — <a href="mailto:huangtimothy@yahoo.com" className="underline hover:text-white">huangtimothy@yahoo.com</a></p>
      </div>
    </div>
    </main>
  )
}
