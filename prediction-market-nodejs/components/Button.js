import React from 'react';

export default function Button({ onClick, children, disabled, className }) {
  const baseStyle = "border border-gray-400 rounded p-2 bg-gray-200 text-black";
  const disabledStyle = "bg-gray-400 text-gray-600 cursor-not-allowed";

  const combinedClassName = `
    ${baseStyle}
    ${disabled ? disabledStyle : ''}
    ${className || ''}
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName.trim()}
    >
      {children}
    </button>
  );
}