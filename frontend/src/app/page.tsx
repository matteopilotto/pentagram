"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { DropdownMenuFilters } from "@/components/Filters";
import DownloadButton from "@/components/DownloadButton";
import { PromptTextarea } from "@/components/PromptTextarea";
import { generateImage } from "./actions/generate";

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
      const imageUrl = await generateImage(currentPrompt, imageSize, seed);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-[1024px]">
      <form onSubmit={handleSubmit} className="w-full flex justify-center mt-8">
        <div className="flex flex-col space-y-4">
          <div className="flex gap-2">
            <PromptTextarea value={prompt} onChange={setPrompt} />
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

      {generatedImage && (
        <div className="mt-8 mx-auto w-[700px] h-[700px] relative">
          <div className="absolute inset-0 bg-red-0 flex items-center justify-center overflow-hidden">
            <div className="relative group flex items-center justify-center">
              <img
                src={generatedImage}
                alt="Generated image"
                className={`w-auto h-auto transition-opacity duration-300 ease-in-out ${
                  isLoading ? "opacity-0" : "opacity-100"
                } ${
                  generatedImageSize === "square"
                    ? "max-w-[576px] max-h-[576px]"
                    : "max-w-[700px] max-h-[700px]"
                } rounded-lg shadow-xl object-contain`}
                onLoad={(e) => {
                  setTimeout(() => {
                    setIsLoading(false);
                    setGeneratedImageSize(imageSize);
                  }, 100);
                }}
              />
              {!isLoading && <DownloadButton imageUrl={generatedImage} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
