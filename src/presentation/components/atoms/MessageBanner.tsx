import React from 'react';

export default function MessageBanner(props: { message: string }) {
  if (!props.message) return null;
  return <div className="message">{props.message}</div>;
}

