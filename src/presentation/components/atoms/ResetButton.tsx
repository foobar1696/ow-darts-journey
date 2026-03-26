import React from 'react';

export default function ResetButton(props: { disabled: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      className={props.className}
      disabled={props.disabled}
      onClick={props.onClick}
      title="クールタイム中のマップをリセット"
    >
      CTリセット
    </button>
  );
}
