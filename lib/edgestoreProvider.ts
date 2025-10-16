'use client';

import { type EdgeStoreRouter } from './edgestore'; // Import the TYPE from the server file
import { createEdgeStoreProvider } from '@edgestore/react';
 
const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>();
 
// We export the client-side provider and hook from this file.
export { EdgeStoreProvider, useEdgeStore };