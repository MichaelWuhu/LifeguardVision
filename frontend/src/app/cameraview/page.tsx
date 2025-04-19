'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Info, Settings } from 'lucide-react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import WebcamStream from "@/components/webcam-stream";

async function getDeviceName(): Promise<string> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevice = devices.find((device) => device.kind === 'videoinput');
  return videoDevice?.label || 'Attempting to access camera...';
}

export default function CameraView() {
  const [isOperational, setIsOperational] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [deviceName, setDeviceName] = useState<string>(
    'Attempting to access camera...'
  );
  const [autoDial, setAutoDial] = useState(false);
  const [toggleLines, setToggleLines] = useState(false);
  const [uploadVideo, setUploadVideo] = useState(false);

  useEffect(() => {
    getDeviceName().then((name) => setDeviceName(name));
  }, []);

  useEffect(() => {
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

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white select-none caret-transparent">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 transition-transforms duration-200 hover:scale-105"
        >
          <div className="bg-white rounded-full p-1">
            <Image
              src="/logo.svg"
              alt="Lifeguard Vision"
              className="object-contain"
              width={40}
              height={40}
            ></Image>
          </div>
          <h1 className="text-xl font-serif text-gray-800 italic font-bold">
            Lifeguard Vision
          </h1>
        </Link>
        <button
          className="group flex items-center gap-2 text-gray-800 transition-transform duration-200 hover:scale-105"
          onClick={() => setOpenSettings(!openSettings)}
        >
          <span className="text-xl">Settings</span>
          <Settings
            className={`w-8 h-8 transition-transform duration-300 group-hover:rotate-120`}
            style={{
              transform: openSettings ? 'rotate(120deg)' : 'rotate(0deg)',
            }}
          />
        </button>
      </header>

      <main
        className={`flex px-15 md:px-30 lg:px-50 gap-4 flex-1 p-4 transition-all duration-300 ease-in-out ${
          openSettings ? 'translate-x-[-6vw]' : ''
        }`}
      >
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm sm:text-lg md:text-xl text-gray-800">
              {deviceName}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-lg md:text-xl text-gray-800">
                {isOperational
                  ? 'Vision Status: Operational'
                  : 'Vision Status: Offline'}
              </span>
              <div
                className={`w-4 h-4 rounded-full  ${
                  isOperational ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              ></div>
            </div>
          </div>

          {/* Camera view */}
          <div
            className={`relative bg-gray-200 aspect-video w-full rounded-md overflow-hidden" ${
              !isOperational ? 'animate-pulse' : ''
            }`}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-md"
              // crossOrigin ensures the <video> element is rendered consistently between server-side and client-side hydration.
              crossOrigin="anonymous"
              onLoadedData={() => {
                setIsOperational(true);
                getDeviceName().then((name) => setDeviceName(name));
              }}
            />
            {!isOperational && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80">
                <p className="text-xl text-gray-800">Camera not available</p> {/* perhaps replace with "cannot connect to server" or smthin */}
              </div>
            )}
          </div>
          <div className="flex justify-end py-3">
            <button
              className="bg-red-400 hover:bg-red-500 text-gray-800 font-bold py-3 px-12 rounded-md text-xl transition-colors"
              onClick={() => alert('Emergency call initiated')}
            >
              Call 911
            </button>
          </div>
        </div>
      </main>

      {/* Settings panel */}
      {openSettings && (
        <div className="fixed right-8 top-17 w-60 bg-white border-1 border-gray-500 rounded-md p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info
                        className={`w-4 h-4 transition-transform duration-300`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="bg-white border-1 rounded-md p-2">
                        Auto dial 911 when drowning is detected after 3 seconds.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>Auto Dial 911</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={autoDial}
                  onChange={(e) => setAutoDial(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-400"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info
                        className={`w-4 h-4 transition-transform duration-300`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="bg-white border-1 rounded-md p-2">
                        Toggle the appearance of Vision lines over footage.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>Toggle Lines</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={toggleLines}
                  onChange={(e) => setToggleLines(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-400"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info
                        className={`w-4 h-4 transition-transform duration-300`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="bg-white border-1 rounded-md p-2">
                        Upload video footage to identify.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>Upload Video</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={uploadVideo}
                  onChange={(e) => setUploadVideo(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-400"></div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
