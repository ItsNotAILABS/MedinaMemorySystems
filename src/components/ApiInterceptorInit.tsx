'use client';

import { useEffect } from 'react';
import { installApiInterceptor } from '@/lib/apiInterceptor';

/**
 * Installs the client-side API interceptor on mount.
 * This enables the app to work as a fully static site
 * by routing /api/* fetch calls to in-memory engines.
 */
export default function ApiInterceptorInit() {
  useEffect(() => {
    installApiInterceptor();
  }, []);

  return null;
}
