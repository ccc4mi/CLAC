class AudioSynthesizer {
    constructor() {
        this.ctx = null;
        this.lastPlayTime = 0;
        this.minInterval = 0.02; // Minimum 20ms between sounds to avoid saturation
        this.enabled = true;
        this.volume = 0.5;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(val) {
        this.volume = val;
    }

    setEnabled(val) {
        this.enabled = val;
        if (val) this.init();
    }

    playClack(intensity = 1.0) {
        if (!this.enabled || this.volume <= 0) return;

        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        if (now - this.lastPlayTime < this.minInterval) return;
        this.lastPlayTime = now;

        // Limit intensity
        const velocity = Math.min(Math.max(intensity, 0.1), 1.0);
        const gainValue = velocity * this.volume * 0.15; // Keep a subtle volume

        // 1. Create Nodes
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        // 2. Configure Filter (Bandpass to simulate resonating plastic)
        filter.type = 'bandpass';
        // Random base frequency to simulate slightly differently sized beads
        const baseFreq = 1200 + (Math.random() - 0.5) * 300;
        filter.frequency.setValueAtTime(baseFreq, now);
        filter.Q.setValueAtTime(5, now);

        // 3. Configure Oscillator (Triangle wave is smooth but has plastic harmonics)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        // Fast exponential frequency decay (the contact hit)
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.04);

        // 4. Configure Amplitude Envelope (Immediate attack, very fast decay)
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(gainValue, now + 0.002);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        // 5. Start and Stop
        osc.start(now);
        osc.stop(now + 0.05);
    }
}

export const audioSynth = new AudioSynthesizer();
