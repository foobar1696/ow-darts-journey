import React from 'react';

export default function MainTemplate(props: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  leftCollapsed?: boolean;
}) {
  return (
    <div className="layout">
      <div className={`panel left${props.leftCollapsed ? ' is-collapsed' : ''}`}>{props.left}</div>
      <div className="panel center">{props.center}</div>
      {props.right ? <div className="panel right">{props.right}</div> : null}
    </div>
  );
}
