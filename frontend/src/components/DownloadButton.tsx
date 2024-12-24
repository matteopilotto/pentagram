import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  imageUrl: string;
}

const DownloadButton = ({ imageUrl }: DownloadButtonProps) => {
  const handleDownload = async () => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = imageUrl.split("/").pop() || "image.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      className="absolute top-2 right-2 mr-4 mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 border"
      size="icon"
      variant="secondary"
    >
      <Download className="!w-4 !h-4" />
    </Button>
  );
};

export default DownloadButton;
