import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * クールタイムリセット時のフェード待ち状態を管理する hook。
 */
export function useCooldownResetFlow(durationMs: number) {
  const [isResetting, setIsResetting] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startReset = useCallback(
    (onAfterFadeOut: () => void) => {
      setIsResetting(true);
      timeoutRef.current = window.setTimeout(() => {
        onAfterFadeOut();
        setIsResetting(false);
        timeoutRef.current = null;
      }, durationMs);
    },
    [durationMs],
  );

  return {
    isResetting,
    startReset,
  };
}
