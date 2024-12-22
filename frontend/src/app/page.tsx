"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { DropdownMenuFilters } from "@/components/Filters";
import DownloadButton from "@/components/DownloadButton";
import { PromptTextarea } from "@/components/PromptTextarea";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageSize, setImageSize] = useState("square");
  const [generatedImageSize, setGeneratedImageSize] = useState("");
  const [seed, setSeed] = useState<number | null>(null);
  const handleSeedChange = (newSeed: number | null) => {
    setSeed(newSeed);
  };
  const handleImageSizeChange = (size: string) => {
    setImageSize(size);
  };
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("seed", seed);
      const currentPrompt = prompt;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPrompt, imageSize, seed }),
      });

      const { image } = await response.json();
      setGeneratedImage(image);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setGeneratedImageSize(imageSize);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-[1024px]">
      <form onSubmit={handleSubmit} className="w-full flex justify-center mt-8">
        <div className="flex flex-col space-y-4">
          <div className="flex gap-2">
            <PromptTextarea
              value={prompt}
              onChange={setPrompt}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="default"
                size="default"
                className="px-6 py-3 h-[54px] text-lg shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="!w-6 !h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Send className="!w-6 !h-6" />
                  </div>
                )}
              </Button>
              <DropdownMenuFilters
                onImageSizeChange={handleImageSizeChange}
                onSeedChange={handleSeedChange}
              />
            </div>
          </div>
        </div>
      </form>

      <div className="flex justify-center mt-8">
        {generatedImage && (
          <div className="w-[700px] h-[700px] flex items-center justify-center">
            <div className="relative group flex items-center justify-center">
              <img
                src={generatedImage}
                alt="Generated image"
                className={`${
                  generatedImageSize === "square"
                    ? "max-w-[512px] max-h-[576px]"
                    : "max-w-[700px] max-h-[700px]"
                } w-auto h-auto object-contain rounded-xl shadow-xl border border-gray-300`}
              />
              <DownloadButton imageUrl={generatedImage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
