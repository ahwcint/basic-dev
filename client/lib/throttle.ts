import { useEffect, useMemo, useRef } from 'react';

type ThrottleFn = (...args: unknown[]) => unknown;

export function throttle<T extends ThrottleFn>(fn: T, limit: number = 500) {
  let lastCall = 0;
  let timeout: NodeJS.Timeout;
  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    if (now - lastCall < limit) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), limit);
      return;
    }
    clearTimeout(timeout);
    lastCall = now;
    fn.apply(this, args);
  } as T;
}

export function useThrottle<T extends ThrottleFn>(fn: T, limit: number = 500) {
  const fnRef = useRef(fn);
  const throttleMemo = useMemo(() => throttle((...args) => fnRef.current(args), limit), [limit]);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  return throttleMemo as T;
}
