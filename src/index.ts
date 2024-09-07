import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const IMAGE_PATH: string = "./images/example.jpg";
const IMAGE_MIMETYPE: string = "image/png";
const IMAGE_ALT_TEXT: string = "brief alt text description of the image";

const agent = new AtpAgent({
  service: "https://bsky.social",
});

async function main() {
  await agent.login({
    identifier: process.env.IDENTIFIER!,
    password: process.env.PASSWORD!,
  });

  const imageBuffer = fs.readFileSync(IMAGE_PATH);
  const imageBlob = await agent.uploadBlob(imageBuffer, {
    encoding: IMAGE_MIMETYPE,
  });

  await agent.post({
    $type: "app.bsky.feed.post",
    text: "POSTING VIA API",
    createdAt: new Date().toISOString(),
    embed: {
      $type: "app.bsky.embed.images",
      images: [
        {
          alt: IMAGE_ALT_TEXT,
          image: imageBlob.data.blob,
        }
      ],
    },
  });
}

main().catch(console.error);
