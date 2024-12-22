"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

interface DropdownMenuFiltersProps {
  onImageSizeChange: (size: string) => void;
  onSeedChange: (seed: number | null) => void;
}

export function DropdownMenuFilters({
  onImageSizeChange,
  onSeedChange,
}: DropdownMenuFiltersProps) {
  const [imageSize, setImageSize] = useState("square");
  const [seed, setSeed] = useState<number | null>(null);

  const handleValueChange = (value: string) => {
    setImageSize(value);
    onImageSizeChange(value);
  };

  const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const seedValue = value === "" ? null : parseInt(value);
    setSeed(seedValue);
    onSeedChange(seedValue);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="px-6 py-3 h-[54px] text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-lg"
        >
          <SlidersHorizontal className="!w-6 !h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-1">
        <DropdownMenuLabel>Image Size</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={imageSize}
          onValueChange={handleValueChange}
        >
          <DropdownMenuRadioItem value="square">
            Square (1:1)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="landscape">
            Landscape (16:9)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="portrait">
            Portrait (9:16)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Seed</DropdownMenuLabel>
        <Input
          type="number"
          placeholder="Enter seed (optional)"
          value={seed ?? ""}
          onChange={handleSeedChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
