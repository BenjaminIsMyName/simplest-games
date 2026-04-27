const confettiColors = ['#0061a4', '#fabd00', '#78dc77', '#9ecaff', '#ffdf9e', '#94f990'];

export const buildConfettiBurst = (burstId) => ({
  id: burstId,
  pieces: Array.from({ length: 26 }, (_, index) => ({
    id: `${burstId}-${index}`,
    left: 8 + Math.random() * 84,
    delay: Math.random() * 0.18,
    duration: 1 + Math.random() * 0.65,
    drift: -95 + Math.random() * 190,
    rotate: -180 + Math.random() * 360,
    color: confettiColors[index % confettiColors.length],
    size: 9 + Math.random() * 10,
    drop: 140 + Math.random() * 70,
  })),
});
