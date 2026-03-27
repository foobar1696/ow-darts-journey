import React, { useEffect, useState } from 'react';

const CLOSE_ANIMATION_MS = 160;

const steps = ['ボタンを押します', 'マップが選ばれます', 'オーバーウォッチを楽しみます'] as const;

const notes = [
  'マップルールを選んで抽選できます',
  '同じマップルールが続かないようにしています',
  '`CTリセット` で、クールタイム中のマップをまとめて抽選対象に戻せます',
] as const;

type UsageGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UsageGuideModal({ isOpen, onClose }: UsageGuideModalProps) {
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      return undefined;
    }

    if (!isRendered) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setIsRendered(false);
    }, CLOSE_ANIMATION_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isOpen, isRendered]);

  if (!isRendered) {
    return null;
  }

  return (
    <div className={`manual-modal-backdrop${isOpen ? '' : ' is-closing'}`} onClick={onClose}>
      <section
        id="usage-modal"
        className={`manual-modal${isOpen ? '' : ' is-closing'}`}
        aria-label="使い方"
        aria-modal="true"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="manual-modal-header">
          <div className="manual-panel-title">使い方</div>
          <button type="button" className="manual-close-button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <ol className="manual-panel-list">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <ul className="manual-panel-note-list">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
