import WebcamStream from "@/components/WebcamStream";

export default function LivePage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Live Detection</h1>
      <WebcamStream />
    </main>
  );
}
