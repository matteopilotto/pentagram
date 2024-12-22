import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useRef, useState } from "react";

interface PromptTextareaProps {
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function PromptTextarea({
  disabled,
  value,
  onChange,
}: PromptTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to allow proper recalculation
      textarea.style.height = "auto";
      const newHeight = Math.max(textarea.scrollHeight, 100); // minimum 100px
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    // Initial height adjustment
    adjustHeight();

    // Add resize listener
    window.addEventListener("resize", adjustHeight);

    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, []);

  // Adjust height whenever value changes
  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div className="grid w-full gap-2">
      <Textarea
        ref={textareaRef}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        placeholder="Type your message here."
        className="w-[700px] min-h-[116px] px-6 py-3 !text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-lg transition-height duration-200"      />
    </div>
  );
}
