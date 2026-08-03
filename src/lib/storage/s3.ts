import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;

if (
  !endpoint ||
  !region ||
  !accessKeyId ||
  !secretAccessKey
) {
  throw new Error(
    "S3 storage environment variables are not configured",
  );
}

export const s3 = new S3Client({
  endpoint,
  region,

  credentials: {
    accessKeyId,
    secretAccessKey,
  },

  forcePathStyle: true,
});