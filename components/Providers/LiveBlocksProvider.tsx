"use client";

import { LiveblocksProvider } from '@liveblocks/react/suspense'
import { env } from 'process';

function LiveBlocksProvider({children}:{children: React.ReactNode}) {

    if(!env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY){
        throw new Error("public liveblocks key not found")
    }

  return (
    <LiveblocksProvider authEndpoint={"/api/auth-endpoint"} throttle={16} publicApiKey={env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY}>
        {children}
    </LiveblocksProvider>
  )
}
export default LiveBlocksProvider