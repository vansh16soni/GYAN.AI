import React, { useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  tiltDegree?: number;
  glowColor?: string;
  onClick?: () => void;
}

export default function TiltCard({
  children,
  className = '',
  tiltDegree = 12,
  glowColor = 'rgba(16, 185, 129, 0.3)',
  onClick,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * tiltDegree;
    const rotateY = ((x - centerX) / centerX) * tiltDegree;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.18s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.25s ease',
      }}
      className={`relative overflow-hidden rounded-2xl border transition-colors preserve-3d will-change-transform ${className}`}
    >
      {/* Dynamic Specular Sheen / Light Reflection */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle 220px at ${glarePosition.x}% ${glarePosition.y}%, ${glowColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}
