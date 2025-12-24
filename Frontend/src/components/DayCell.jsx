import React from 'react';

function hexToHSL(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

function colorForStreak(streak, baseColor) {
  if (!streak) return 'transparent';
  const { h, s } = hexToHSL(baseColor || '#22c55e');

  // Green spectrum matching reference image:
  // Streak 1: Very light green (L ~ 88%)
  // Streak 30+: Deep green (L ~ 25%)
  const maxStreak = 30;
  const minL = 25;
  const maxL = 88;

  const clampedStreak = Math.min(streak, maxStreak);
  // Progress from 0 (streak 1) to 1 (streak 30)
  const progress = (clampedStreak - 1) / Math.max(1, maxStreak - 1);

  // Interpolate lightness from maxL to minL
  const l = maxL - (progress * (maxL - minL));

  return `hsl(${h}, ${s}%, ${l}%)`;
}

export default function DayCell({ value, streak, onToggle, color, isWeekend }) {
  const bg = value ? colorForStreak(streak || value, color) : (isWeekend ? 'var(--cell-weekend)' : 'var(--cell-empty)');
  const hasValue = Boolean(value);

  return (
    <button
      className={`day-cell ${isWeekend ? 'weekend' : ''} ${hasValue ? 'active' : ''}`}
      style={{ background: bg }}
      onClick={onToggle}
      title={value ? `${streak} day streak` : 'Mark done'}
    />
  );
}
