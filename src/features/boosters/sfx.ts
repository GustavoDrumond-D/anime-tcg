// Efeitos sonoros sintetizados com Web Audio API: sem arquivos de áudio.
// ponytail: sons procedurais; trocar por samples gravados na fase de polimento se quisermos timbre próprio.

let ctx: AudioContext | null = null
let muted = false

export const setMuted = (m: boolean) => {
  muted = m
}

function ac(): AudioContext | null {
  if (muted || typeof AudioContext === 'undefined') return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** Ruído branco filtrado com varredura de frequência: base de rasgo, virada e deslize. */
function noise(dur: number, from: number, to: number, gain: number, q = 1) {
  const c = ac()
  if (!c) return
  const t = c.currentTime
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = q
  f.frequency.setValueAtTime(from, t)
  f.frequency.exponentialRampToValueAtTime(to, t + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(c.destination)
  src.start(t)
}

function tone(freq: number, delay: number, dur: number, gain: number, type: OscillatorType) {
  const c = ac()
  if (!c) return
  const t = c.currentTime + delay
  const o = c.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur)
}

export const sfx = {
  /** Pedacinho de corte enquanto arrasta. */
  snip: () => noise(0.05, 3500, 5000, 0.12, 2),
  /** Rasgo final do pacote. */
  rip: () => noise(0.4, 1800, 7000, 0.45, 0.7),
  deal: () => noise(0.12, 700, 2200, 0.1, 1.5),
  flip: () => noise(0.2, 500, 3200, 0.22, 2),
  rare: (r: 'SSR' | 'UR') => {
    const notes =
      r === 'UR' ? [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98] : [587.33, 739.99, 880]
    notes.forEach((f, i) => tone(f, i * 0.07, 1.1, 0.1, r === 'UR' ? 'triangle' : 'sine'))
    if (r === 'UR') noise(1.2, 4000, 9000, 0.08, 0.5) // brilho "cintilante"
  },
}
