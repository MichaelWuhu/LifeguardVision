"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, Settings } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import VideoUpload from "@/components/video-upload";

async function getDeviceName(): Promise<string> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevice = devices.find((device) => device.kind === "videoinput");
  return videoDevice?.label || "Attempting to access camera...";
}

export default function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [alert, setAlert] = useState(false);
  const [frameBase64, setFrameBase64] = useState<string | null>(null);
  const [isOperational, setIsOperational] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [deviceName, setDeviceName] = useState<string>(
    "Attempting to access camera..."
  );
  const [autoDial, setAutoDial] = useState(false);
  const [toggleLines, setToggleLines] = useState(false);
  const [uploadVideo, setUploadVideo] = useState(false);

  const [inputSource, setInputSource] = useState<"camera" | "file">("camera");
  const [videoFile, setVideoFile] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [showAlertBanner, setShowAlertBanner] = useState(false);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:8000/ws/stream");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { frame, ...rest } = data;
      console.log("Server response:", rest); // LOG 1 (from server)
      setAlert(data.alert);
      if (frame) {
        setFrameBase64(`data:image/jpeg;base64,${frame}`);
      }
    };

    if (inputSource === 'camera') {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            streamRef.current = stream;
          }

          intervalRef.current = setInterval(() => {
            if (!canvasRef.current || !videoRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0);

            canvasRef.current.toBlob((blob) => {
              if (blob && ws.readyState === WebSocket.OPEN) {
                ws.send(blob);
              }
            }, 'image/jpeg');
          }, 250);
        })
        .catch((err) => {
          console.error('Camera access failed or aborted by user:', err);
        });
    } else if (inputSource === 'file' && videoFile) {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = videoFile;
        videoRef.current.play();
        setIsOperational(true);

        intervalRef.current = setInterval(() => {
          if (!canvasRef.current || !videoRef.current) return;
          const ctx = canvasRef.current.getContext('2d');
          if (!ctx) return;

          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);

          canvasRef.current.toBlob((blob) => {
            if (blob && wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(blob);
            }
          }, 'image/jpeg');
        }, 250); // 4 fps
      }
    }

    return () => {
      // 🔁 CLEANUP on mode switch
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      setIsOperational(false);
    };
  }, [inputSource, videoFile]);

  useEffect(() => {
    const handleVideoReady = (e: CustomEvent) => {
      const url = e.detail;
      console.log("📹 Video is ready to play:", url);
      setVideoFile(url);
      setInputSource("file");
    };

    window.addEventListener("video-ready", handleVideoReady as EventListener);

    return () => {
      window.removeEventListener(
        "video-ready",
        handleVideoReady as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const handleUploadStart = () => {
      setShowAlertBanner(true);
    };
  
    window.addEventListener("video-upload-started", handleUploadStart);
  
    return () => {
      window.removeEventListener("video-upload-started", handleUploadStart);
    };
  }, [showAlertBanner]);

  useEffect(() => {
    const handleUploadEnd = () => {
      setShowAlertBanner(false);
    };
  
    window.addEventListener("video-upload-ended", handleUploadEnd);
  
    return () => {
      window.removeEventListener("video-upload-ended", handleUploadEnd);
    };
  }, [showAlertBanner]);

  useEffect(() => {
    console.log("✅ showAlertBanner changed to:", showAlertBanner);
  }, [showAlertBanner]);
  

  useEffect(() => {
    getDeviceName().then((name) => setDeviceName(name));
  }, []);

  useEffect(() => {
    setInputSource(uploadVideo ? "file" : "camera");
  }, [uploadVideo]);

  return (
    <div className="min-h-screen bg-white select-none caret-transparent">
      {/* Header */}
      <div className="w-full bg-white reative z-10">
        <nav className="container mx-auto flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            >
              <div className="bg-white rounded-full p-2">
                <Image
                  src="/logo.svg"
                  alt="Lifeguard Vision"
                  className="object-contain"
                  width={40}
                  height={40}
                />
              </div>
              <h1 className="text-xl font-serif italic font-bold text-gray-800">
                Lifeguard Vision
              </h1>
            </Link>
          </div>
          <button
            className="border-1 border-black bg-red-200 hover:bg-red-400 group flex items-center gap-2 text-gray-800 px-4 py-2 rounded-md font-medium transition-transform duration-200 hover:scale-105"
            onClick={() => setOpenSettings(!openSettings)}
          >
            <span className="text-medium">Settings</span>
            <Settings
              className={`w-6 h-6 transition-transform duration-300 group-hover:rotate-120`}
              style={{
                transform: openSettings ? 'rotate(120deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        </nav>
      </div>
      {uploadVideo ? (
        <div>
          <VideoUpload />
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
          {showAlertBanner ? <div
            className="m-5 w-30 mx-auto z-10 px-4 py-2 rounded-lg bg-opacity-75"
            style={{
              backgroundColor: alert
                ? 'rgba(239, 68, 68, 0.9)'
                : 'rgba(34, 197, 94, 0.9)',
            }}
          >
            {alert ? (
              <p className="text-white font-bold text-lg">⚠️ ALERT DETECTED</p>
            ) : (
              <p className="text-white font-medium">✓ All clear</p>
            )}
          </div>
          :
          <div />
          }
        </div>
      ) : (
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
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
              <div
                className="absolute bottom-5 left-4 z-10 px-4 py-2 rounded-lg bg-opacity-75"
                style={{
                  backgroundColor: alert
                    ? 'rgba(239, 68, 68, 0.9)'
                    : 'rgba(34, 197, 94, 0.9)',
                }}
              >
                {alert ? (
                  <p className="text-white font-bold text-lg">
                    ⚠️ ALERT DETECTED
                  </p>
                ) : (
                  <p className="text-white font-medium">✓ All clear</p>
                )}
              </div>
              {frameBase64 && toggleLines && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={frameBase64}
                  alt="Live pose frame"
                  className="mt-4 rounded shadow max-w-full"
                />
              )}
              {!isOperational && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80">
                  <p className="text-xl text-gray-800">Camera not available</p>{' '}
                  {/* perhaps replace with "cannot connect to server" or smthin */}
                </div>
              )}
            </div>
            <div className="flex justify-end py-3">
              <button
                className="bg-red-400 hover:bg-red-500 text-gray-800 font-bold py-3 px-12 rounded-md text-xl transition-colors"
                onClick={() => window.alert('Emergency call initiated')}
              >
                Call 911
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Settings panel */}
      {openSettings && (
        <div className="fixed right-8 top-21 w-60 bg-white border-1 border-gray-500 rounded-md p-6 overflow-y-auto">
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
                  onChange={(e) => {
                    setUploadVideo(e.target.checked);
                    setInputSource(e.target.checked ? "file" : "camera");
                  }}
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
