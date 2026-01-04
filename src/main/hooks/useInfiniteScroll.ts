import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100
}: UseInfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = loadingRef.current;
    if (!element) return;

    let scrollContainer: Element | null = null;
    let current: Element | null = element.parentElement;
    
    while (current) {
      const classList = Array.from(current.classList);
      if (classList.some(cls => cls.includes('statementsListContainer') || cls.includes('statementListWrapper'))) {
        scrollContainer = current;
        break;
      }
      current = current.parentElement;
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: scrollContainer,
      rootMargin: `${threshold}px`,
      threshold: 0.1
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return loadingRef;
} 