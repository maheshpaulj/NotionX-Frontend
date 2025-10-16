import { edgeStoreRouter } from '@/lib/edgestore';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };