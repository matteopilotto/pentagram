import { STATUS_CODES } from "http";
import { Postpone } from "next/dist/server/app-render/dynamic-rendering";
import { NextResponse } from "next/server";

export const runtime = "edge";

const modal_endpoint =
  "https://matteopilotto--example-text-to-image-inference-web.modal.run";

export async function POST(request: Request) {
  try {
    const { currentPrompt: prompt, imageSize, seed } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      prompt,
      size: imageSize,
    });

    if (seed) {
      params.append("seed", seed.toString());
    }

    const url = `${modal_endpoint}?${params.toString()}`;
    console.log("URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = `data:image/png;base64,${Buffer.from(
      arrayBuffer
    ).toString("base64")}`;

    return NextResponse.json({ success: true, image: base64Image });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
