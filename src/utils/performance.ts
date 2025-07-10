// Performance optimization utilities

// Debounce function for input handling
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll/resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy loading utility
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

// Memoization utility for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Virtual scrolling for large lists
export const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

// Image optimization
export const optimizeImage = (
  src: string,
  width?: number,
  height?: number,
  quality = 80
): string => {
  // In a real app, this would integrate with an image optimization service
  // For now, we'll return the original src
  return src;
};

// Bundle size optimization - dynamic imports
export const loadComponent = async (componentName: string) => {
  switch (componentName) {
    case 'AIAssistant':
      return import('../components/AIAssistant');
    case 'BulletPointGenerator':
      return import('../components/BulletPointGenerator');
    case 'ExportModal':
      return import('../components/ExportModal');
    default:
      throw new Error(`Component ${componentName} not found`);
  }
};

// Performance monitoring
export const performanceMonitor = {
  mark: (name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof performance !== 'undefined') {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      console.log(`${name}: ${measure.duration}ms`);
      return measure.duration;
    }
    return 0;
  },
  
  clearMarks: () => {
    if (typeof performance !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
};