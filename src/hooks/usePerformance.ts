import { useCallback, useEffect, useRef } from 'react';
import { debounce, throttle, performanceMonitor } from '../utils/performance';

// Hook for debounced input handling
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const debouncedCallback = useRef(debounce(callback, delay));
  
  useEffect(() => {
    debouncedCallback.current = debounce(callback, delay);
  }, [callback, delay]);
  
  return useCallback((...args: Parameters<T>) => {
    debouncedCallback.current(...args);
  }, []);
};

// Hook for throttled event handling
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  limit: number
) => {
  const throttledCallback = useRef(throttle(callback, limit));
  
  useEffect(() => {
    throttledCallback.current = throttle(callback, limit);
  }, [callback, limit]);
  
  return useCallback((...args: Parameters<T>) => {
    throttledCallback.current(...args);
  }, []);
};

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    performanceMonitor.mark(`${componentName}-mount-start`);
    
    return () => {
      performanceMonitor.mark(`${componentName}-unmount`);
      performanceMonitor.measure(
        `${componentName}-lifecycle`,
        `${componentName}-mount-start`,
        `${componentName}-unmount`
      );
    };
  }, [componentName]);
  
  const measureRender = useCallback((renderName: string) => {
    performanceMonitor.mark(`${componentName}-${renderName}-start`);
    
    return () => {
      performanceMonitor.mark(`${componentName}-${renderName}-end`);
      performanceMonitor.measure(
        `${componentName}-${renderName}`,
        `${componentName}-${renderName}-start`,
        `${componentName}-${renderName}-end`
      );
    };
  }, [componentName]);
  
  return { measureRender };
};

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = (
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) => {
  const targetRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      options
    );
    
    observer.observe(target);
    
    return () => observer.disconnect();
  }, [callback, options]);
  
  return targetRef;
};

// Hook for optimized re-renders
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
) => {
  return useCallback(callback, deps);
};

// Hook for memory leak prevention
export const useCleanup = (cleanup: () => void) => {
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
};