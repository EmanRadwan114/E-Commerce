import { createBlob } from "@vercel/blob";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const fileStream = fs.createReadStream(
    path.resolve("./public/invoice/invoice.pdf")
  );

  try {
    // Upload the file to Vercel Blob
    const { url } = await createBlob(fileStream, {
      mimeType: "application/pdf",
    });

    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
}
