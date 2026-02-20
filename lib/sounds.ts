// Synthesized sound effects using Web Audio API — no external files needed

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

export function playPop() {
  const ctx = getCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(600, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
  g.gain.setValueAtTime(0.35, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.15);
}

export function playChime() {
  const ctx = getCtx();
  [523, 659, 784].forEach((freq, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
    g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + i * 0.12);
    o.stop(ctx.currentTime + i * 0.12 + 0.5);
  });
}

export function playClick() {
  const ctx = getCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "square";
  o.frequency.value = 800;
  g.gain.setValueAtTime(0.15, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.06);
}

export function playSuccess() {
  const ctx = getCtx();
  [440, 554, 659, 880].forEach((freq, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    const t = ctx.currentTime + i * 0.1;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.4);
  });
}

export function playWrong() {
  const ctx = getCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(300, ctx.currentTime);
  o.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.2);
  g.gain.setValueAtTime(0.15, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.2);
}

export function playBreathTone(rising: boolean) {
  const ctx = getCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  const startFreq = rising ? 220 : 330;
  const endFreq = rising ? 330 : 220;
  o.frequency.setValueAtTime(startFreq, ctx.currentTime);
  o.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + 1);
  g.gain.setValueAtTime(0.08, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 1);
}
