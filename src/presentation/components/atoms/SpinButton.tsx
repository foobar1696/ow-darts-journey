import React from 'react';

export default function SpinButton(props: { disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" className="spin-launch-button" disabled={props.disabled} onClick={props.onClick}>
      <span className="spin-launch-button-core">
        <span className="spin-launch-button-label">START</span>
      </span>
    </button>
  );
}
