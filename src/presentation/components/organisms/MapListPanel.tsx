import React, { useLayoutEffect, useRef, useState } from 'react';
import type { CooldownMapItem } from '../../../types';
import ResetButton from '../atoms/ResetButton';

const PANEL_HEIGHT_TRANSITION_MS = 280;

export default function MapListPanel(props: {
  cooldownMaps: CooldownMapItem[];
  isResetting?: boolean;
  resetDisabled: boolean;
  onReset: () => void;
}) {
  const { cooldownMaps, isResetting = false, resetDisabled, onReset } = props;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelBodyRef = useRef<HTMLDivElement | null>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const isFirstRenderRef = useRef(true);
  const hasCooldownMaps = cooldownMaps.length > 0;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const body = panelBodyRef.current;
    if (!panel || !body) return;

    const nextHeight = body.getBoundingClientRect().height;

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    const currentHeight = panel.getBoundingClientRect().height;
    if (Math.abs(currentHeight - nextHeight) < 1) {
      return;
    }

    setPanelHeight(currentHeight);

    const frameId = window.requestAnimationFrame(() => {
      setPanelHeight(nextHeight);
    });
    const timeoutId = window.setTimeout(() => {
      setPanelHeight(null);
    }, PANEL_HEIGHT_TRANSITION_MS);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [cooldownMaps.length, isResetting]);

  return (
    <div className="map-list-panel" ref={panelRef} style={panelHeight === null ? undefined : { height: panelHeight }}>
      <div ref={panelBodyRef}>
        <div className="history-panel-header">
          <div className="map-list-title">クールタイム中のマップ</div>
          {hasCooldownMaps ? (
            <div className="map-list-header-action">
              <ResetButton className="history-clear-button" disabled={resetDisabled} onClick={onReset} />
            </div>
          ) : null}
        </div>
        {hasCooldownMaps ? (
          <div className="message map-list-note map-list-note-panel">
            <div>一度選ばれたマップは24時間経過すると再び抽選対象になります。</div>
          </div>
        ) : null}
        {!hasCooldownMaps ? (
          <div className="map-list-empty">クールタイム中のマップはありません</div>
        ) : (
          <div className="map-list-table-scroll">
            <div className={`excluded-map-inline-list${isResetting ? ' is-fading-out' : ''}`}>
              {cooldownMaps.map((item, index) => (
                <React.Fragment key={item.mapId}>
                  {index > 0 ? <span className="excluded-map-separator"> / </span> : null}
                  <span className="excluded-map-name">{item.mapName}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
