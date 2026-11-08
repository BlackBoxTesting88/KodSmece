const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

// Finish the image handoff before moving any individual ingredient.
// A flat horizontal turn avoids nested perspective/backface rendering on iOS.
export function gyrosMotion(rawProgress: number) {
  const progress = clamp(Number.isFinite(rawProgress) ? rawProgress : 0);
  const turn = smoothstep(clamp((progress - .08) / .26));
  const spread = smoothstep(clamp((progress - .34) / .66));
  return {
    progress,
    turn,
    spread,
    faceWidth: Math.max(.001, Math.abs(Math.cos(Math.PI * turn))),
    face: turn < .5 ? 'whole' : 'pieces',
  };
}
