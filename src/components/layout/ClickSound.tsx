'use client';

import { useEffect, useRef } from 'react';

type AudioRig = {
  ctx: AudioContext;
  filter: BiquadFilterNode;
  gain: GainNode;
  buffer: AudioBuffer;
};

/**
 * Reference UI click sound, reproduced from the live site's implementation:
 * a 4ms burst of exponentially-decaying noise through a bandpass filter
 * (Q=8) with slight random pitch variation. Fully synthesized — no audio
 * asset, no latency. The AudioContext is only created/resumed inside a user
 * gesture handler, satisfying browser autoplay policies.
 */
export default function ClickSound() {
  const rigRef = useRef<AudioRig | null>(null);

  useEffect(() => {
    const INTENSITY = 1;

    function ensureAudio(): AudioRig | null {
      if (typeof AudioContext === 'undefined') return null;
      if (!rigRef.current) {
        const ctx = new AudioContext();
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 4000;
        filter.Q.value = 8;
        const gain = ctx.createGain();
        filter.connect(gain);
        gain.connect(ctx.destination);
        const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(0.004 * ctx.sampleRate)), ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (2 * Math.random() - 1) * Math.exp(-i / 25);
        rigRef.current = { ctx, filter, gain, buffer };
      }
      if (rigRef.current.ctx.state === 'suspended') void rigRef.current.ctx.resume();
      return rigRef.current;
    }

    function play() {
      const rig = ensureAudio();
      if (!rig || rig.ctx.state !== 'running') return;
      const data = rig.buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (2 * Math.random() - 1) * Math.exp(-i / 25);
      rig.gain.gain.value = 0.5 * INTENSITY;
      const detune = 1 + (Math.random() - 0.5) * 0.3;
      rig.filter.frequency.value = (2000 + 2000 * INTENSITY) * detune;
      const source = rig.ctx.createBufferSource();
      source.buffer = rig.buffer;
      source.connect(rig.filter);
      source.onended = () => source.disconnect();
      source.start();
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('a, button, [role="button"], summary, input[type="checkbox"], select')) return;
      play();
    }

    document.addEventListener('click', onClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      rigRef.current?.ctx.close().catch(() => {});
      rigRef.current = null;
    };
  }, []);

  return null;
}
