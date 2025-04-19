'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Info, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function CameraView() {
  const [isOperational, setIsOperational] = useState(true);
  const [autoDialEnabled1, setAutoDialEnabled1] = useState(true);
  const [autoDialEnabled2, setAutoDialEnabled2] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Request camera access when component mounts
    if (typeof navigator !== 'undefined') {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 1920, height: 1080 } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
          setIsOperational(false);
        });
    }

    // Clean up function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.svg"
              alt="Lifeguard Vision Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-bold text-2xl text-gray-700">Lifeguard Vision</h1>
        </div>
        <button className="flex items-center gap-2 text-gray-700">
          <span className="text-xl">Settings</span>
          <Settings className="w-8 h-8" />
        </button>
      </header>

      <main className="flex py-5 px-15 md:px-30 lg:px-50 gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl text-gray-700">Webcam 1080p HD</h2>
            <div className="flex items-center gap-2">
              <span className="text-xl text-gray-700">
                Vision Status: Operational
              </span>
              <div
                className={`w-4 h-4 rounded-full  ${
                  isOperational ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              ></div>
            </div>
          </div>

          {/* Camera view */}
          <div className="relative bg-gray-200 aspect-video w-full rounded-md overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!isOperational && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80">
                <p className="text-xl text-gray-700">Camera not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar
        <div className="w-64 bg-gray-300 rounded-md p-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Auto Dial 911</div>
              <Info className="w-6 h-6 text-gray-700" />
            </div>
            <Switch
              checked={autoDialEnabled1}
              onCheckedChange={setAutoDialEnabled1}
              className="data-[state=checked]:bg-black"
            />

            <div className="mt-8 flex items-center justify-between">
              <div className="text-lg font-medium">Auto Dial 911</div>
              <Info className="w-6 h-6 text-gray-700" />
            </div>
            <Switch
              checked={autoDialEnabled2}
              onCheckedChange={setAutoDialEnabled2}
              className="data-[state=checked]:bg-black"
            />
          </div>
        </div> */}
      </main>

      <div className="flex justify-end p-4">
        <button
          className="bg-red-400 hover:bg-red-500 text-gray-800 font-bold py-3 px-12 rounded-md text-xl transition-colors"
          onClick={() => alert('Emergency call initiated')}
        >
          Call 911
        </button>
      </div>
    </div>
  );
}
