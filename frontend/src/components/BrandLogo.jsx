import React from 'react';

export default function BrandLogo({ size = 'md', className = '' }) {
  const heights = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-20',
  };

  return (
    <img
      src="/mospi-logo.png"
      alt="MoSPI Skill Intelligence Platform"
      className={`${heights[size] || heights.md} w-auto object-contain ${className}`}
    />
  );
}
