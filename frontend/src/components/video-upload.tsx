"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function VideoUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Cleanup blob URL on unmount
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [files]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const handleUpload = async () => {
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        console.log("shouldPlay:", shouldPlay);
        const response = await fetch("http://127.0.0.1:8000/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Upload successful:", data);

        // ⬇️ Notify parent view
        if (data.video_url) {
          window.dispatchEvent(
            new CustomEvent("video-ready", { detail: data.video_url })
          );
        }
      }

      setFiles([]);
      showNotification("Upload completed successfully!", "success");
    } catch (error) {
      console.error("Upload error:", error);
      showNotification("Upload failed. Please try again.", "error");
    }
  };

  const playVideo = () => {
    console.log("shouldPlay:", shouldPlay);
    console.log("videoRef.current exists:", videoRef.current);
    if (shouldPlay && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
      });
    }
  };

  return (
    <div className="space-y-4">
      {notification && (
        <div
          className={`max-w-md mx-auto rounded-md p-4 text-center ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}
      {files.length > 0 && previewUrl ? (
        <video
          ref={videoRef}
          src={previewUrl}
          muted
          playsInline
          className="w-full rounded-md max-w-md mx-auto mt-4 pointer-events-none"
          onClick={(e) => e.preventDefault()}
          onLoadedData={() => setShouldPlay(true)}
        />
      ) : (
        <Card
          className={`border-2 border-dashed p-8 text-center max-w-md mx-auto ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <h3 className="text-lg font-medium">
              Drag and drop your files here
            </h3>
            <p className="text-sm text-gray-500">or</p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="video/mp4,video/quicktime"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported file types: MP4, MOV
            </p>
          </div>
        </Card>
      )}
      {files.length > 0 && (
        <div className="space-y-4 max-w-md mx-auto">
          <div className="space-y-2">
            <h3 className="font-medium">Selected File</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-gray-500" />
                    <span className="text-sm truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove Video</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <Button
            onClick={() => {
              handleUpload();
              playVideo();
            }}
            className="w-full bg-blue-100"
          >
            Upload Video
          </Button>
        </div>
      )}
    </div>
  );
}
