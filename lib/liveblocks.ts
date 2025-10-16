import { Liveblocks } from "@liveblocks/node";

let liveblocks: Liveblocks;

export function getLiveblocksClient(): Liveblocks {
  if (!liveblocks) {
    const key = process.env.LIVEBLOCKS_PRIVATE_KEY;
    if (!key) {
      throw new Error("Liveblocks private key not found");
    }
    
    liveblocks = new Liveblocks({
      secret: key,
    });
  }

  return liveblocks;
}