import { useEffect, useState } from 'react';

/**
 * 指定間隔で現在時刻を更新する表示用 hook。
 */
export function useNowTicker(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
