import { useEffect, useCallback, useRef } from 'react';

// Hook برای مدیریت performance
export const usePerformance = () => {
  const performanceRef = useRef({});

  // شروع اندازه‌گیری زمان
  const startTiming = useCallback((label) => {
    performanceRef.current[label] = performance.now();
  }, []);

  // پایان اندازه‌گیری زمان
  const endTiming = useCallback((label) => {
    const startTime = performanceRef.current[label];
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      delete performanceRef.current[label];
      return duration;
    }
    return null;
  }, []);

  // اندازه‌گیری memory usage
  const getMemoryUsage = useCallback(() => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }, []);

  return {
    startTiming,
    endTiming,
    getMemoryUsage
  };
};

// Hook برای throttling
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Hook برای مدیریت scroll performance
export const useScrollPerformance = (callback, options = {}) => {
  const { throttleMs = 16, passive = true } = options;
  const throttledCallback = useThrottle(callback, throttleMs);

  useEffect(() => {
    const handleScroll = throttledCallback;
    
    window.addEventListener('scroll', handleScroll, { passive });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [throttledCallback, passive]);
};

// Hook برای lazy loading با Intersection Observer
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const targetRef = useRef();
  const observerRef = useRef();

  const observe = useCallback((callback) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback(entry);
          if (triggerOnce) {
            observerRef.current.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }
  }, [threshold, rootMargin, triggerOnce]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { targetRef, observe };
};

// Hook برای مدیریت virtual scrolling
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd).map((item, index) => ({
    ...item,
    index: visibleStart + index
  }));
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
};

export default usePerformance;