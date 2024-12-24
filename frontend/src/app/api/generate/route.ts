import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

const modal_endpoint =
  "https://matteopilotto--example-text-to-image-inference-web.modal.run";

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.SERVER_ACTION_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        "x-api-key": process.env.MODAL_API_KEY!,
      },
    });

    const imageBlob = await response.blob();
    const sanitizedPrompt = prompt
      .split(" ")
      .slice(0, 5)
      .join("-")
      .replace(/[^a-z0-9-]/gi, "")
      .toLowerCase();

    const imageFile = new File(
      [imageBlob],
      `${sanitizedPrompt}-${Date.now()}.png`,
      {
        type: "image/png",
      }
    );

    const { url: imageUrl } = await put(imageFile.name, imageFile, {
      access: "public",
    });

    // const arrayBuffer = await imageBlob.arrayBuffer();
    // const base64Image = `data:image/png;base64,${Buffer.from(
    //   arrayBuffer
    // ).toString("base64")}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
