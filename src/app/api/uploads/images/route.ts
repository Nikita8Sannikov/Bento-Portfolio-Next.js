import {
    PutObjectCommand,
  } from "@aws-sdk/client-s3";
  import { NextResponse } from "next/server";
  
  import { requireAdmin } from "@/lib/auth/require-admin";
  import { s3 } from "@/lib/storage/s3";
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  
  const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]);
  
  export async function POST(request: Request) {
    await requireAdmin();
  
    const formData = await request.formData();
    const file = formData.get("file");
  
    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Image file is required",
        },
        {
          status: 400,
        },
      );
    }
  
    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        {
          error: "Unsupported image format",
        },
        {
          status: 400,
        },
      );
    }
  
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Image must be smaller than 5 MB",
        },
        {
          status: 400,
        },
      );
    }
  
    const bucket = process.env.S3_BUCKET;
    const publicUrl = process.env.S3_PUBLIC_URL;
  
    if (!bucket || !publicUrl) {
      throw new Error(
        "S3 bucket environment variables are not configured",
      );
    }
  
    const extension =
      file.name.split(".").pop()?.toLowerCase() ?? "bin";
  
    const objectKey =
      `tiles/${crypto.randomUUID()}.${extension}`;
  
    const fileBuffer =
      Buffer.from(await file.arrayBuffer());
  
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: file.type,
      }),
    );
  
    return NextResponse.json({
      imageUrl: `${publicUrl}/${objectKey}`,
    });
  }