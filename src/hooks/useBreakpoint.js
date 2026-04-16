import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '../tokens';

/**
 * Responsive shell breakpoints (mobile-first).
 * Used by AppLayout, TopBar, and Sidebar for drawer vs rail layout.
 */
export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.lg
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isDesktop = width >= BREAKPOINTS.lg;
  const isWide = width >= BREAKPOINTS.xl;

  return { width, isMobile, isTablet, isDesktop, isWide };
}
