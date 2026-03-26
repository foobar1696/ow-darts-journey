import React, { useEffect, useMemo, useRef } from 'react';
import type { SlotStatus } from '../../../types';

const STANDARD_MS = 2800;
const ITEM_HEIGHT_PX = 84;
const EXTRA_SPIN_LOOPS = 8;
const ACCEL_FRACTION = 0.08;
const CRUISE_FRACTION = 0.84;

function clampIndex(i: number, len: number) {
  if (len <= 0) return -1;
  return Math.max(0, Math.min(len - 1, i));
}

export default function SlotMachine(props: {
  status: SlotStatus;
  items: string[]; // reel items (already formatted label)
  targetIndex: number; // selected item index in items
  onSpinAnimationFinished: () => void;
}) {
  const { status, items, targetIndex, onSpinAnimationFinished } = props;
  const normalizedTargetIndex = useMemo(
    () => clampIndex(targetIndex, items.length),
    [targetIndex, items.length],
  );

  const reelRef = useRef<HTMLDivElement | null>(null);
  const animsRef = useRef<Animation[]>([]);

  const extendedItems = useMemo(() => {
    if (items.length === 0) return [];

    // 高速回転ぶんも含めて十分な長さのトラックを確保する
    const repeatCount = EXTRA_SPIN_LOOPS + 3;
    return Array.from({ length: repeatCount }, () => items).flat();
  }, [items]);

  const baseOffset = items.length; // middle copy starts at baseOffset
  const spinOffset = items.length * EXTRA_SPIN_LOOPS;

  const endTranslateY = useMemo(() => {
    if (normalizedTargetIndex < 0 || items.length === 0) return 0;
    // viewportは3行で中央を当選ラインにするため、(targetIndex - 1) を使う
    // 高速回転ぶんを余計に流してから停止位置へ合わせる
    return -((baseOffset + spinOffset + normalizedTargetIndex - 1) * ITEM_HEIGHT_PX);
  }, [baseOffset, items.length, normalizedTargetIndex, spinOffset]);

  useEffect(() => {
    if (status !== 'spinning') return;
    if (items.length === 0 || normalizedTargetIndex < 0) return;

    // 既存アニメが残っている場合は停止
    for (const a of animsRef.current) a.cancel();
    animsRef.current = [];

    // 準備: 初期位置へ戻す
    const el = reelRef.current;
    if (!el) return;
    el.style.transform = 'translateY(0px)';

    const easingSpin = 'cubic-bezier(0.15, 0.85, 0.35, 1.00)';
    const accelTranslateY = endTranslateY * ACCEL_FRACTION;
    const cruiseTranslateY = endTranslateY * (ACCEL_FRACTION + CRUISE_FRACTION);

    const a1 = el.animate(
      [
        { transform: 'translateY(0px)', offset: 0 },
        { transform: `translateY(${accelTranslateY}px)`, offset: ACCEL_FRACTION },
        { transform: `translateY(${cruiseTranslateY}px)`, offset: ACCEL_FRACTION + CRUISE_FRACTION },
        { transform: `translateY(${endTranslateY}px)`, offset: 1 },
      ],
      {
        duration: STANDARD_MS,
        easing: easingSpin,
        fill: 'forwards',
      },
    );

    animsRef.current.push(a1);

    const t = window.setTimeout(() => onSpinAnimationFinished(), STANDARD_MS);

    return () => {
      window.clearTimeout(t);
    };
  }, [endTranslateY, items.length, normalizedTargetIndex, onSpinAnimationFinished, status]);

  const showEmpty = items.length === 0;
  const showingResultHighlight = status === 'stopping' || status === 'result';

  return (
    <div className="slot-area" aria-busy={status === 'spinning' || status === 'stopping'}>
      <div className="slot-viewport">
        <div className="slot-fade slot-fade-top" />
        <div className="slot-fade slot-fade-bottom" />
        <div className={`slot-focus-window${showingResultHighlight ? ' slot-focus-window-result' : ''}`} />
        <div className="slot-grid">
          <div className="slot-reel">
            <div
              className="slot-reel-track"
              ref={reelRef}
              style={{
                height: ITEM_HEIGHT_PX * 3,
              }}
            >
              {showEmpty ? (
                <div className="slot-empty">候補なし</div>
              ) : (
                extendedItems.map((label, i) => (
                  <div className="slot-item" key={i}>
                    {label}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
