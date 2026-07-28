import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getStorageFilePath } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string[] }> },
) {
  const { file: pathSegments } = await params;
  const relativePath = path.join(...pathSegments);

  const filePath = getStorageFilePath(relativePath);
  if (!filePath) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileStream = fs.createReadStream(filePath);
  const ext = path.extname(filePath).toLowerCase();

  let contentType = "application/octet-stream";
  if (ext === ".mp3") contentType = "audio/mpeg";
  else if (ext === ".wav") contentType = "audio/wav";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".json") contentType = "application/json";
  else if (ext === ".pdf") contentType = "application/pdf";

  const stream = new ReadableStream({
    start(controller) {
      fileStream.on("data", (chunk) => controller.enqueue(chunk));
      fileStream.on("end", () => controller.close());
      fileStream.on("error", (err) => controller.error(err));
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": stat.size.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
