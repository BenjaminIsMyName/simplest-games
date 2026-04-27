import React from 'react';

export const RewardConfetti = ({ bursts }) => (
  <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
    {bursts.map((burst) =>
      burst.pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-16 rounded-sm shadow-[0_2px_8px_rgba(15,23,42,0.18)]"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${Math.max(6, piece.size * 0.65)}px`,
            backgroundColor: piece.color,
            animation: `step-order-confetti ${piece.duration}s ease-out forwards`,
            animationDelay: `${piece.delay}s`,
            ['--confetti-drift']: `${piece.drift}px`,
            ['--confetti-drop']: `${piece.drop}px`,
            ['--confetti-rotate']: `${piece.rotate}deg`,
          }}
        />
      )),
    )}
  </div>
);
