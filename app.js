const root = document.documentElement;
const $ = selector => document.querySelector(selector);
root.classList.add('js');

const osMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let quietMotion = osMotion.matches;
let motionReduced = quietMotion;
let giftOpened = false;
let opening = false;
let frameId = 0;
let lastTime = 0;
let filmVisible = false;
let userUnlockedAudio = false;

// Theme state: 'ghibli' (Studio Ghibli Healing Green) | 'celestial' (Celestial Luxury)
let currentTheme = localStorage.getItem('site_theme_pref') || 'ghibli';

let pointer = {
  x: innerWidth / 2,
  y: innerHeight / 2,
  sx: innerWidth / 2,
  sy: innerHeight / 2,
  vx: 0,
  vy: 0
};

const welcome = $('#welcome');
const film = $('#love-film');
const canvas = $('#universe');
const ctx = canvas ? canvas.getContext('2d') : null;
const photoLayers = [...document.querySelectorAll('[data-depth]')];

// Particles & Effects storage
const particles = [];
const trailParticles = [];
let stars = [];
let petals = [];
let dandelions = [];
let width = innerWidth;
let height = innerHeight;

/* ==========================================================================
   VIDEO SYNCHRONIZATION
   ========================================================================== */
function syncFilm() {
  if (!film) return;
  if (filmVisible && giftOpened && !motionReduced && !document.hidden) {
    film.play().catch(() => {});
  } else {
    film.pause();
  }
}

/* ==========================================================================
   MOTION PREFERENCES & ACCESSIBILITY
   ========================================================================== */
function setMotion() {
  motionReduced = quietMotion || osMotion.matches;
  root.classList.toggle('reduced-motion', motionReduced);
  const toggleBtn = $('#motion-toggle');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-pressed', String(motionReduced));
    toggleBtn.setAttribute('aria-label', motionReduced ? 'Bật hiệu ứng chuyển động' : 'Giảm hiệu ứng chuyển động');
    const label = toggleBtn.querySelector('.motion-label');
    if (label) label.textContent = motionReduced ? 'Hiệu ứng dịu nhẹ' : 'Hiệu ứng đầy đủ';
  }
  photoLayers.forEach(layer => { layer.style.translate = ''; });
  syncFilm();
  restartCanvas();
}

$('#motion-toggle')?.addEventListener('click', () => {
  quietMotion = !motionReduced;
  setMotion();
  playASMR('sparkle');
  if (osMotion.matches) notice('Đang giữ chuyển động nhẹ theo cài đặt của thiết bị.');
});
osMotion.addEventListener('change', setMotion);

/* ==========================================================================
   THEME SWITCHER ENGINE: COSMIC LUXURY <-> GHIBLI ANIME KAWAII
   ========================================================================== */
function applyTheme(theme, userTriggered = false) {
  currentTheme = theme;
  localStorage.setItem('site_theme_pref', theme);
  root.dataset.theme = theme;

  const toggleBtn = $('#theme-toggle');
  const emblem = $('#brand-emblem');
  const isGhibli = theme === 'ghibli';

  if (toggleBtn) {
    const icon = toggleBtn.querySelector('.theme-icon');
    const label = toggleBtn.querySelector('.theme-label');
    if (isGhibli) {
      if (icon) icon.textContent = '✨';
      if (label) label.textContent = 'Vũ trụ Luxury';
      toggleBtn.setAttribute('aria-label', 'Chuyển sang phong cách Vũ trụ Luxury lãng mạn');
    } else {
      if (icon) icon.textContent = '🍃';
      if (label) label.textContent = 'Ghibli Đồng Cỏ';
      toggleBtn.setAttribute('aria-label', 'Chuyển về phong cách Ghibli Anime Đồng Cỏ');
    }
  }

  if (emblem) {
    emblem.src = isGhibli ? 'assets/ghibli-emblem-2k.webp' : 'assets/emerald-sky-emblem-2k.webp';
    emblem.style.transform = 'scale(0.8) rotate(180deg)';
    setTimeout(() => { emblem.style.transform = ''; }, 350);
  }

  // Reseed canvas particles for the chosen style
  resizeCanvas();

  if (userTriggered) {
    // Screen transition ripple overlay
    const ripple = document.createElement('div');
    ripple.className = 'theme-transition-ripple';
    ripple.style.background = isGhibli
      ? 'radial-gradient(circle, rgba(149, 213, 178, 0.45) 0%, rgba(16, 38, 31, 0.95) 75%)'
      : 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(2, 6, 17, 0.95) 75%)';
    document.body.appendChild(ripple);
    requestAnimationFrame(() => ripple.classList.add('active'));
    setTimeout(() => ripple.remove(), 600);

    playASMR(isGhibli ? 'ghibli-sparkle' : 'sparkle');
    notice(isGhibli ? '🍃 Đã chuyển sang: Ghibli Anime Đồng Cỏ Mùa Hè 🌸' : '✨ Đã chuyển sang: Vũ trụ Luxury Lãng Mạn 🌌');
    if (toggleBtn) {
      const rect = toggleBtn.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 75);
    } else {
      burst(width * 0.5, height * 0.35, 75);
    }
  }
}

$('#theme-toggle')?.addEventListener('click', (e) => {
  e.preventDefault();
  const nextTheme = currentTheme === 'ghibli' ? 'cosmic' : 'ghibli';
  applyTheme(nextTheme, true);
});

/* ==========================================================================
   ROMANTIC AUDIO & ASMR ENGINE (DUAL SYMPHONY & DUAL ASMR)
   ========================================================================== */
let audio = null;
let master = null;
let reverb = null;
let musicTimer = 0;
let soundOn = false;
let soundBusy = false;
let nextChordTime = 0;
let chordStep = 0;
let nextArpTime = 0;
let arpStep = 0;
let lastTouch = 0;
let noticeTimer = 0;
const voices = new Set();

// 1. Cosmic Romantic Chords: Fmaj9 -> Cmaj7 -> Dm9 -> Am9 -> G6add9 -> Em7
const cosmicChords = [
  { root: 174.61, bass: 87.31, notes: [261.63, 329.63, 392.00, 523.25, 659.25] },
  { root: 130.81, bass: 65.41, notes: [261.63, 329.63, 392.00, 493.88, 587.33] },
  { root: 146.83, bass: 73.42, notes: [261.63, 349.23, 440.00, 523.25, 659.25] },
  { root: 110.00, bass: 55.00, notes: [261.63, 329.63, 392.00, 493.88, 523.25] },
  { root: 98.00,  bass: 49.00, notes: [246.94, 293.66, 392.00, 440.00, 587.33] },
  { root: 164.81, bass: 82.41, notes: [246.94, 329.63, 392.00, 493.88, 587.33] }
];

// 2. Ghibli Anime Kawaii Chords (Joe Hisaishi style sweet pentatonic warmth: Gmaj7 -> Dadd9/F# -> Em9 -> Cadd9 -> Am9 -> D7)
const ghibliChords = [
  { root: 196.00, bass: 98.00, notes: [246.94, 293.66, 369.99, 493.88, 587.33] }, // Gmaj7
  { root: 185.00, bass: 92.50, notes: [220.00, 293.66, 329.63, 440.00, 587.33] }, // Dadd9/F#
  { root: 164.81, bass: 82.41, notes: [246.94, 293.66, 329.63, 369.99, 493.88] }, // Em9
  { root: 130.81, bass: 65.41, notes: [261.63, 293.66, 329.63, 392.00, 523.25] }, // Cadd9
  { root: 110.00, bass: 55.00, notes: [220.00, 261.63, 329.63, 440.00, 493.88] }, // Am9
  { root: 146.83, bass: 73.42, notes: [220.00, 261.63, 293.66, 369.99, 587.33] }  // D7
];

function notice(text) {
  const el = $('#sound-notice');
  if (!el) return;
  el.textContent = text;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { el.textContent = ''; }, 4500);
}

function trackVoice(source) {
  voices.add(source);
  source.addEventListener('ended', () => voices.delete(source), { once: true });
}

function tone(frequency, when, duration, volume, type = 'sine', output = master, detune = 0) {
  if (!audio || audio.state !== 'running') return;
  const osc = audio.createOscillator();
  const env = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, when);
  if (detune) osc.detune.setValueAtTime(detune, when);

  env.gain.setValueAtTime(0.0001, when);
  env.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), when + 0.035);
  env.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  osc.connect(env).connect(output);
  trackVoice(osc);
  osc.start(when);
  osc.stop(when + duration + 0.05);
}

// Warm ambient celestial pad tone
function padVoice(frequency, when, duration, volume = 0.04) {
  if (!audio || audio.state !== 'running') return;
  const osc1 = audio.createOscillator();
  const osc2 = audio.createOscillator();
  const filter = audio.createBiquadFilter();
  const env = audio.createGain();

  osc1.type = 'sine';
  osc2.type = 'triangle';
  osc1.frequency.setValueAtTime(frequency, when);
  osc2.frequency.setValueAtTime(frequency, when);
  osc2.detune.setValueAtTime(currentTheme === 'ghibli' ? 4 : 6, when);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(currentTheme === 'ghibli' ? 950 : 750, when);
  filter.frequency.exponentialRampToValueAtTime(currentTheme === 'ghibli' ? 1400 : 1100, when + duration * 0.4);
  filter.frequency.exponentialRampToValueAtTime(650, when + duration);

  env.gain.setValueAtTime(0.0001, when);
  env.gain.exponentialRampToValueAtTime(volume, when + (currentTheme === 'ghibli' ? 0.8 : 1.2));
  env.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(env);
  env.connect(reverb || master);

  trackVoice(osc1);
  trackVoice(osc2);
  osc1.start(when);
  osc2.start(when);
  osc1.stop(when + duration + 0.1);
  osc2.stop(when + duration + 0.1);
}

// Sweet kalimba / anime music box voice
function kalimbaVoice(frequency, when, duration, volume = 0.035) {
  if (!audio || audio.state !== 'running') return;
  const osc = audio.createOscillator();
  const overtone = audio.createOscillator();
  const env = audio.createGain();

  osc.type = 'sine';
  overtone.type = 'sine';
  osc.frequency.setValueAtTime(frequency, when);
  overtone.frequency.setValueAtTime(frequency * 2.76, when); // Kalimba metallic bell harmonic

  env.gain.setValueAtTime(0.0001, when);
  env.gain.exponentialRampToValueAtTime(volume, when + 0.008);
  env.gain.exponentialRampToValueAtTime(volume * 0.35, when + 0.15);
  env.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  osc.connect(env);
  overtone.connect(env);
  env.connect(reverb || master);

  trackVoice(osc);
  trackVoice(overtone);
  osc.start(when);
  overtone.start(when);
  osc.stop(when + duration + 0.05);
  overtone.stop(when + duration + 0.05);
}

// Dynamic Music Scheduler: adapts seamlessly between Cosmic & Ghibli modes
function scheduleRomanticMusic() {
  if (!soundOn || !audio || audio.state !== 'running' || document.hidden) return;
  const now = audio.currentTime;
  const activeChords = currentTheme === 'ghibli' ? ghibliChords : cosmicChords;

  // Schedule Chord Changes
  while (nextChordTime < now + 0.8) {
    const chord = activeChords[chordStep % activeChords.length];
    const duration = currentTheme === 'ghibli' ? 4.2 : 4.8;

    // Sub-bass warmth
    tone(chord.bass, nextChordTime, duration * 0.9, 0.05, 'sine', reverb);

    // Pad chord harmony
    chord.notes.forEach((freq, idx) => {
      padVoice(freq, nextChordTime + idx * 0.035, duration, currentTheme === 'ghibli' ? 0.032 : 0.035);

      // In Ghibli mode: add sweet kalimba chime arpeggios
      if (currentTheme === 'ghibli') {
        kalimbaVoice(freq * 1.5, nextChordTime + 0.1 + idx * 0.22, 1.8, 0.024);
      } else if (idx % 2 === 0) {
        tone(freq * 2, nextChordTime + 0.15 + idx * 0.25, 2.2, 0.015, 'sine', reverb);
      }
    });

    nextChordTime += currentTheme === 'ghibli' ? 4.0 : 4.5;
    chordStep++;
  }

  // Schedule Arpeggio / Bell Notes
  while (nextArpTime < now + 0.4) {
    const currentChord = activeChords[Math.max(0, chordStep - 1) % activeChords.length];
    const arpNotes = currentChord.notes;
    const noteFreq = arpNotes[arpStep % arpNotes.length];

    if (currentTheme === 'ghibli') {
      kalimbaVoice(noteFreq * (Math.random() > 0.5 ? 2 : 1), nextArpTime, 1.4, 0.03);
      nextArpTime += 0.55 + (Math.random() * 0.2);
    } else {
      tone(noteFreq * (Math.random() > 0.6 ? 2 : 1), nextArpTime, 1.8, 0.022, 'sine', reverb);
      nextArpTime += 0.75 + (Math.random() * 0.25);
    }
    arpStep++;
  }
}

function syncSoundLabels() {
  const toggle = $('#sound-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(soundOn));
    const label = $('#sound-label');
    if (label) {
      label.textContent = soundOn
        ? (currentTheme === 'ghibli' ? 'Nhạc Ghibli & ASMR ♡' : 'Nhạc Vũ trụ & ASMR ♡')
        : 'Bật nhạc & ASMR';
    }
  }
  const introSound = $('#intro-sound');
  if (introSound) {
    introSound.setAttribute('aria-pressed', String(soundOn));
    introSound.textContent = soundOn ? '♫ Giai điệu đang phát · Chạm để tắt' : '♫ Bật nhạc & ASMR ngọt ngào';
  }
}

async function stopSound() {
  soundOn = false;
  clearInterval(musicTimer);
  voices.forEach(voice => { try { voice.stop(); } catch {} });
  voices.clear();
  syncSoundLabels();
  if (audio?.state === 'running') {
    await audio.suspend().catch(() => {});
  }
}

async function startSound() {
  if (soundBusy) return;
  soundBusy = true;
  try {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) throw new Error('unsupported');
    if (!audio) {
      audio = new AudioEngine();
      master = audio.createGain();
      master.gain.value = 0.75;

      const limiter = audio.createDynamicsCompressor();
      limiter.threshold.value = -12;
      limiter.knee.value = 8;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.25;

      master.connect(limiter).connect(audio.destination);

      // Lush 2.5s stereo convolution reverb
      reverb = audio.createConvolver();
      const impulse = audio.createBuffer(2, Math.ceil(audio.sampleRate * 2.5), audio.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = impulse.getChannelData(c);
        for (let i = 0; i < d.length; i++) {
          const decay = (1 - i / d.length) ** 2.2;
          d[i] = (Math.random() * 2 - 1) * decay;
        }
      }
      reverb.buffer = impulse;
      reverb.connect(master);
    }

    if (audio.state !== 'running') {
      await audio.resume();
    }
    if (audio.state !== 'running' || document.hidden) throw new Error('playback unavailable');

    soundOn = true;
    nextChordTime = audio.currentTime + 0.1;
    nextArpTime = audio.currentTime + 0.3;
    scheduleRomanticMusic();
    clearInterval(musicTimer);
    musicTimer = setInterval(scheduleRomanticMusic, 180);
    syncSoundLabels();
    playASMR(currentTheme === 'ghibli' ? 'ghibli-chime' : 'chime');
  } catch {
    await stopSound();
    notice('Thiết bị chưa bật được âm thanh. Em vẫn có thể xem trọn món quà nhé.');
  } finally {
    soundBusy = false;
  }
}

async function toggleSound() {
  if (soundOn) await stopSound();
  else await startSound();
}

/* ==========================================================================
   MULTI-LAYERED ASMR SOUND ENGINE (COSMIC & GHIBLI AESTHETIC)
   ========================================================================== */
function playASMR(kind = 'tap') {
  if (!audio || audio.state !== 'running' || document.hidden) return;
  const now = audio.currentTime;
  if (now - lastTouch < 0.04) return;
  lastTouch = now;

  const isGhibli = currentTheme === 'ghibli';

  // GHIBLI KAWAII SOUNDS
  if (kind === 'ghibli-pop' || (isGhibli && kind === 'droplet')) {
    const osc = audio.createOscillator();
    const env = audio.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1750, now + 0.06);
    env.gain.setValueAtTime(0.001, now);
    env.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(env).connect(reverb);
    trackVoice(osc);
    osc.start(now);
    osc.stop(now + 0.12);
    return;
  }

  if (kind === 'ghibli-chime' || (isGhibli && kind === 'chime')) {
    // Japanese summer Furin wind chime
    tone(1318.51, now, 1.2, 0.06, 'sine', reverb);
    tone(1975.53, now + 0.05, 1.4, 0.045, 'sine', reverb);
    tone(2637.02, now + 0.12, 1.1, 0.02, 'sine', reverb);
    return;
  }

  if (kind === 'ghibli-sparkle' || (isGhibli && kind === 'sparkle')) {
    // Anime transformation fairy sparkle
    const animeFreqs = [1567, 1975, 2349, 2793, 3136];
    animeFreqs.forEach((f, i) => {
      tone(f, now + i * 0.03, 0.7, 0.03, 'sine', reverb);
    });
    return;
  }

  // COSMIC / STANDARD SOUNDS
  if (kind === 'heart') {
    if (isGhibli) {
      // Cute anime double bell heart pulse
      tone(523.25, now, 0.22, 0.08, 'sine', reverb);
      tone(659.25, now + 0.12, 0.35, 0.07, 'sine', reverb);
      tone(1046.5, now + 0.25, 1.6, 0.05, 'sine', reverb);
      return;
    }
    // Binaural realistic heartbeat
    tone(55, now, 0.22, 0.24, 'sine', master);
    tone(110, now, 0.18, 0.08, 'triangle', master);
    tone(49, now + 0.26, 0.26, 0.20, 'sine', master);
    tone(98, now + 0.26, 0.22, 0.07, 'triangle', master);
    tone(523.25, now + 0.55, 2.2, 0.05, 'sine', reverb);
    tone(659.25, now + 0.72, 2.0, 0.04, 'sine', reverb);
    return;
  }

  if (kind === 'chime') {
    tone(783.99, now, 1.4, 0.06, 'sine', reverb);
    tone(1046.5, now + 0.06, 1.6, 0.045, 'sine', reverb);
    tone(1567.98, now + 0.12, 1.2, 0.02, 'sine', reverb);
    return;
  }

  if (kind === 'sparkle') {
    const freqs = [1760, 2093, 2637, 3136, 3520];
    freqs.forEach((f, i) => {
      tone(f, now + i * 0.035, 0.8, 0.025, 'sine', reverb);
    });
    return;
  }

  if (kind === 'droplet') {
    const osc = audio.createOscillator();
    const env = audio.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1250, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.08);
    env.gain.setValueAtTime(0.001, now);
    env.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(env).connect(reverb);
    trackVoice(osc);
    osc.start(now);
    osc.stop(now + 0.14);
    return;
  }

  // Synthesized Parchment / Polaroid / Soft Paw Tap
  const duration = kind === 'envelope' || kind === 'paper' ? 0.75 : kind === 'photo' ? 0.28 : 0.09;
  const buffer = audio.createBuffer(2, Math.ceil(audio.sampleRate * duration), audio.sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const samples = buffer.getChannelData(channel);
    let brown = 0;
    for (let i = 0; i < samples.length; i++) {
      brown = (brown + (Math.random() * 2 - 1) * 0.12) / 1.05;
      const progress = i / samples.length;
      let texture = 1;
      if (kind === 'envelope' || kind === 'paper') {
        texture = 0.35 + 0.65 * Math.sin(progress * 32) ** 2;
      }
      samples[i] = brown * Math.sin(Math.PI * progress) ** 1.3 * texture;
    }
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = kind === 'envelope' ? 2200 : kind === 'paper' ? 1800 : kind === 'photo' ? 1300 : 580;
  filter.Q.value = kind === 'envelope' ? 0.8 : 0.65;

  const gain = audio.createGain();
  gain.gain.value = kind === 'envelope' ? 0.5 : kind === 'photo' ? 0.45 : 0.35;

  const pan = audio.createStereoPanner();
  pan.pan.value = (Math.random() * 0.4) - 0.2;

  source.connect(filter).connect(gain).connect(pan).connect(master);
  trackVoice(source);
  source.start();

  if (kind === 'envelope') {
    tone(920, now + 0.03, 0.12, 0.08, 'triangle', master);
    tone(1567.98, now + 0.15, 1.2, 0.035, 'sine', reverb);
    tone(2093.00, now + 0.25, 1.4, 0.025, 'sine', reverb);
  } else if (kind === 'photo') {
    tone(isGhibli ? 440 : 320, now, 0.06, 0.04, 'sine', master);
  } else if (kind === 'tap') {
    const randomPitch = isGhibli ? (330 + Math.random() * 60) : (230 + Math.random() * 45);
    tone(randomPitch, now, 0.06, 0.035, 'sine', master);
  }
}

// Auto-unlock audio on ANY first user gesture
function unlockAudioOnFirstGesture() {
  if (!userUnlockedAudio) {
    userUnlockedAudio = true;
    startSound().catch(() => {});
  }
}
window.addEventListener('pointerdown', unlockAudioOnFirstGesture, { once: true, passive: true });
window.addEventListener('touchstart', unlockAudioOnFirstGesture, { once: true, passive: true });
window.addEventListener('keydown', unlockAudioOnFirstGesture, { once: true, passive: true });

$('#sound-toggle')?.addEventListener('click', toggleSound);
$('#intro-sound')?.addEventListener('click', toggleSound);

// Connect click events across all interactive elements for delightful ASMR feedback
document.addEventListener('click', event => {
  const control = event.target.closest('button, a, .gallery-photo, [data-photo]');
  if (!control) {
    playASMR(currentTheme === 'ghibli' ? 'ghibli-pop' : 'droplet');
    if (event.clientX && event.clientY) burst(event.clientX, event.clientY, 15);
    return;
  }
  if (['sound-toggle', 'intro-sound', 'theme-toggle'].includes(control.id)) return;

  let kind = 'tap';
  if (control.id === 'open-gift') kind = 'envelope';
  else if (control.id === 'hug-button') kind = 'heart';
  else if (control.hasAttribute('data-photo') || control.id?.startsWith('photo-')) kind = 'photo';
  else if (control.id === 'motion-toggle') kind = 'sparkle';
  else if (control.tagName === 'A') kind = 'chime';

  playASMR(kind);
});

/* ==========================================================================
   ENVELOPE OPENING & GIFT REVEAL
   ========================================================================== */
function openGift(skip = false) {
  if (opening) return;
  opening = true;

  if (!soundOn) {
    startSound().catch(() => {});
  }
  playASMR('envelope');

  welcome.classList.add('opening');
  const env = welcome.querySelector('.envelope');
  if (env) {
    const rect = env.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 85);
  }

  if (typeof gsap !== 'undefined' && !skip && !motionReduced) {
    // Cho phép người dùng nhìn thấy nắp thư mở và lá thư trượt lên nằm trọn trong bao thư trước khi phóng qua camera
    gsap.delayedCall(0.75, () => {
      if (env) {
        gsap.to(env, {
          scale: 2.4,
          filter: 'blur(20px)',
          opacity: 0,
          duration: 1.15,
          ease: 'power3.inOut'
        });
      }
      gsap.to(welcome, {
        opacity: 0,
        scale: 1.08,
        duration: 1.1,
        ease: 'power2.inOut',
        onComplete: () => {
          welcome.close();
          document.body.classList.remove('dialog-open');
          root.classList.add('gift-opened');
          giftOpened = true;
          animateHeroFanOut();
          syncFilm();
          burst(width * 0.5, height * 0.45, 95);
        }
      });
      gsap.fromTo('#home', {
        scale: 1.12,
        filter: 'blur(12px)'
      }, {
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'expo.out',
        delay: 0.1
      });
    });
  } else {
    setTimeout(() => {
      welcome.close();
      document.body.classList.remove('dialog-open');
      root.classList.add('gift-opened');
      giftOpened = true;

      const destination = skip ? $('#letter') : $('#home');
      if (destination) {
        destination.tabIndex = -1;
        destination.focus({ preventScroll: true });
        if (skip) destination.scrollIntoView({ behavior: motionReduced ? 'instant' : 'smooth' });
      }
      syncFilm();
      if (!motionReduced) {
        burst(width * 0.5, height * 0.45, 95);
        animateHeroFanOut();
      }
    }, motionReduced ? 0 : 750);
  }
}

$('#open-gift')?.addEventListener('click', () => openGift(false));
$('#skip-intro')?.addEventListener('click', () => openGift(true));
welcome?.addEventListener('cancel', event => { event.preventDefault(); openGift(false); });

if (welcome && typeof welcome.showModal === 'function') {
  welcome.showModal();
  document.body.classList.add('dialog-open');
}

/* ==========================================================================
   INTERSECTION OBSERVERS & SCROLL REVEALS
   ========================================================================== */
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal').forEach((element, index) => {
    if (element.classList.contains('gallery-photo')) {
      element.style.setProperty('--delay', `${(index % 5) * 0.06}s`);
    }
    revealObserver.observe(element);
  });

  if (film) {
    new IntersectionObserver(entries => {
      filmVisible = entries[0].isIntersecting;
      syncFilm();
    }, { threshold: 0.1 }).observe(film);
  }
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
}

/* ==========================================================================
   HIGH-RES PHOTO LIGHTBOX WITH TOUCH SWIPE (MOBILE OPTIMIZED)
   ========================================================================== */
const photos = [...document.querySelectorAll('[data-photo]')];
const photoDialog = $('#photo-dialog');
const viewerImage = $('#viewer-image');
let photoIndex = 0;
let photoTrigger = null;

function openPhoto(index) {
  if (!photos.length || !photoDialog) return;
  photoIndex = (index + photos.length) % photos.length;
  const image = photos[photoIndex].querySelector('img');
  const errorEl = $('#photo-error');
  if (errorEl) errorEl.hidden = true;

  if (viewerImage && image) {
    viewerImage.style.visibility = 'visible';
    viewerImage.src = image.src;
    viewerImage.alt = image.alt;
  }

  const countEl = $('#photo-count');
  if (countEl) countEl.textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${photos.length}`;

  const captionEl = $('#photo-caption');
  const labelEl = photos[photoIndex].querySelector('.photo-label span');
  if (captionEl && labelEl) captionEl.textContent = labelEl.textContent;

  if (!photoDialog.open && typeof photoDialog.showModal === 'function') {
    photoDialog.showModal();
    document.body.classList.add('dialog-open');
  }
}

photos.forEach((button, index) => {
  button.addEventListener('click', () => {
    photoTrigger = button;
    openPhoto(index);
    playASMR('photo');
  });
});

$('#photo-prev')?.addEventListener('click', () => {
  openPhoto(photoIndex - 1);
  playASMR('photo');
});
$('#photo-next')?.addEventListener('click', () => {
  openPhoto(photoIndex + 1);
  playASMR('photo');
});
$('#photo-close')?.addEventListener('click', () => {
  photoDialog?.close();
  playASMR('tap');
});

viewerImage?.addEventListener('error', () => {
  viewerImage.style.visibility = 'hidden';
  const errorEl = $('#photo-error');
  if (errorEl) errorEl.hidden = false;
});

photoDialog?.addEventListener('click', event => {
  if (event.target === photoDialog) {
    photoDialog.close();
    playASMR('tap');
  }
});

photoDialog?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    openPhoto(photoIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    playASMR('photo');
  }
});

photoDialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  photoTrigger?.focus({ preventScroll: true });
});

// Mobile Touch Swipe Gesture for Lightbox (iPhone, Vivo, Android)
let touchStartX = 0;
let touchStartY = 0;
photoDialog?.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

photoDialog?.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  // Horizontal swipe detected
  if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX < 0) {
      // Swiped left -> next
      openPhoto(photoIndex + 1);
    } else {
      // Swiped right -> prev
      openPhoto(photoIndex - 1);
    }
    playASMR('photo');
  }
}, { passive: true });

/* ==========================================================================
   LUXURY 3D PHOTO CARD PARALLAX TILT & HOVER INTERACTION
   ========================================================================== */
function initPhotoTiltEffects() {
  const photoCards = document.querySelectorAll('.gallery-photo, .memory-photo, .hero-photo');
  photoCards.forEach(card => {
    card.addEventListener('pointerenter', () => {
      playASMR('chime');
    });

    card.addEventListener('pointermove', e => {
      if (motionReduced) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -12;
      const rotY = ((x - centerX) / centerX) * 12;

      const imgWrapper = card.querySelector('.gallery-image, .image-clip, img');
      if (imgWrapper) {
        imgWrapper.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
      }

      // Micro stardust on hover
      if (Math.random() > 0.72) {
        trailParticles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 35,
          vy: -Math.random() * 30 - 15,
          age: 0,
          life: 0.65,
          size: 2.2 + Math.random() * 3,
          heart: Math.random() > 0.6,
          color: Math.random() > 0.5 ? '#55efc4' : '#38bdf8'
        });
      }
    });

    card.addEventListener('pointerleave', () => {
      const imgWrapper = card.querySelector('.gallery-image, .image-clip, img');
      if (imgWrapper) {
        imgWrapper.style.transform = '';
      }
    });
  });
}

/* ==========================================================================
   CANVAS PARTICLE ENGINE: COSMIC 3D PETALS & GHIBLI SAKURA / DANDELIONS
   ========================================================================== */
function resizeCanvas() {
  if (!canvas || !ctx) return;
  width = innerWidth;
  height = innerHeight;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const small = width < 760;
  const isGhibli = currentTheme === 'ghibli';

  // Stars / Sunshine Bokeh Motes
  stars = Array.from({ length: small ? 55 : 120 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * (isGhibli ? 2.2 : 1.4) + 0.35,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.8 + 0.4,
    color: isGhibli
      ? (Math.random() > 0.4 ? '#ffe082' : Math.random() > 0.5 ? '#7bed9f' : '#bfe6ff')
      : (Math.random() > 0.45 ? '#55efc4' : Math.random() > 0.4 ? '#38bdf8' : '#ffffff'),
    hasCross: Math.random() > 0.8
  }));

  // Falling Petals & Leaves (Emerald & Sky Blue for Cosmic, Meadow Sakura for Ghibli)
  petals = Array.from({ length: small ? 14 : 28 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * (isGhibli ? 9 : 8) + 6,
    vx: (Math.random() - 0.5) * (isGhibli ? 26 : 20),
    vy: Math.random() * (isGhibli ? 22 : 24) + 16,
    rotX: Math.random() * Math.PI * 2,
    rotY: Math.random() * Math.PI * 2,
    rotZ: Math.random() * Math.PI * 2,
    vRotX: (Math.random() - 0.5) * 1.5,
    vRotY: (Math.random() - 0.5) * 2.2,
    vRotZ: (Math.random() - 0.5) * 1.2,
    colorA: isGhibli ? '#7bed9f' : (Math.random() > 0.5 ? '#00d284' : '#55efc4'),
    colorB: isGhibli ? '#ffe082' : (Math.random() > 0.5 ? '#38bdf8' : '#70a1ff'),
    phase: Math.random() * 10
  }));

  // Ghibli Dandelion Fluffs
  dandelions = isGhibli ? Array.from({ length: small ? 8 : 16 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 5 + 3,
    vx: (Math.random() - 0.5) * 12,
    vy: -(Math.random() * 16 + 10), // Float gently upward
    phase: Math.random() * 6
  })) : [];

  if (motionReduced) ctx.clearRect(0, 0, width, height);
}

// Draw Sakura Petal (with curved notched tip) for Ghibli
function drawSakuraPetal(p, time) {
  const cosX = Math.cos(p.rotX);
  const cosY = Math.cos(p.rotY);
  const scale = p.size / 10;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotZ);
  ctx.scale(scale * Math.abs(cosY), scale * Math.abs(cosX));

  const grad = ctx.createLinearGradient(-10, -10, 10, 10);
  grad.addColorStop(0, p.colorA);
  grad.addColorStop(1, p.colorB);

  ctx.fillStyle = grad;
  ctx.globalAlpha = Math.min(0.88, 0.5 + Math.abs(cosX) * 0.38);

  // Sakura petal shape with delicate notched tip
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.bezierCurveTo(4, -13, 3, -11, 2, -10);
  ctx.bezierCurveTo(12, -4, 12, 6, 0, 14);
  ctx.bezierCurveTo(-12, 6, -12, -4, -2, -10);
  ctx.bezierCurveTo(-3, -11, -4, -13, 0, -14);
  ctx.fill();

  ctx.restore();
}

// Draw 3D Rose Petal for Cosmic
function drawRosePetal3D(p, time) {
  const cosX = Math.cos(p.rotX);
  const cosY = Math.cos(p.rotY);
  const sinZ = Math.sin(p.rotZ);
  const scale = p.size / 10;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotZ);
  ctx.scale(scale * Math.abs(cosY), scale * Math.abs(cosX));

  const grad = ctx.createLinearGradient(-10, -10, 10, 10);
  grad.addColorStop(0, p.colorA);
  grad.addColorStop(1, p.colorB);

  ctx.fillStyle = grad;
  ctx.globalAlpha = Math.min(0.85, 0.45 + Math.abs(cosX) * 0.4);

  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.bezierCurveTo(9, -14, 14, 2, 0, 12);
  ctx.bezierCurveTo(-14, 2, -9, -14, 0, -12);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.quadraticCurveTo(2 * sinZ, 0, 0, 9);
  ctx.stroke();

  ctx.restore();
}

// Draw Dandelion Spore Fluff for Ghibli
function drawDandelion(d, time) {
  ctx.save();
  ctx.translate(d.x, d.y);
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 0.7;

  // Stalk
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, d.size * 2);
  ctx.stroke();

  // Fluff crown
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * d.size, Math.sin(a) * d.size);
    ctx.stroke();
  }

  // Seed center
  ctx.beginPath();
  ctx.arc(0, d.size * 2, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawHeart(x, y, size, rotation, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(size / 10, size / 10);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 3);
  ctx.bezierCurveTo(-12, -5, -5, -12, 0, -6);
  ctx.bezierCurveTo(5, -12, 12, -5, 0, 3);
  ctx.fill();
  ctx.restore();
}

// Particle explosion with sparkling hearts and golden dust
function burst(x, y, count = 100) {
  if (motionReduced || document.hidden) return;
  const available = Math.max(0, 380 - particles.length);
  const spawnCount = Math.min(count, available);
  const isGhibli = currentTheme === 'ghibli';

  for (let i = 0; i < spawnCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 240;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 60,
      age: 0,
      life: 1.8 + Math.random() * 2.2,
      size: 2.5 + Math.random() * 7.5,
      heart: Math.random() > 0.45,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 6,
      color: isGhibli
        ? (Math.random() > 0.5 ? '#7bed9f' : Math.random() > 0.3 ? '#ffe082' : '#70a1ff')
        : (Math.random() > 0.55 ? '#55efc4' : Math.random() > 0.3 ? '#38bdf8' : '#00d284')
    });
  }
}

function updateProgress() {
  const travel = root.scrollHeight - innerHeight;
  const bar = $('.reading-progress');
  if (bar) {
    bar.style.transform = `scaleX(${travel > 0 ? Math.min(1, scrollY / travel) : 0})`;
  }
}

// Main 60fps render loop
function frame(time) {
  frameId = 0;
  if (document.hidden || motionReduced || !ctx) return;
  const delta = Math.min((time - (lastTime || time)) / 1000, 0.035);
  lastTime = time;
  ctx.clearRect(0, 0, width, height);
  const seconds = time / 1000;
  const isGhibli = currentTheme === 'ghibli';

  // 1. Draw twinkling celestial stars or sunshine bokeh motes
  for (const star of stars) {
    const shimmer = (Math.sin(seconds * star.speed + star.phase) + 1) * 0.5;
    ctx.globalAlpha = 0.25 + shimmer * 0.55;
    ctx.fillStyle = star.color;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius * (0.8 + shimmer * 0.4), 0, Math.PI * 2);
    ctx.fill();

    if (star.hasCross && shimmer > 0.65) {
      ctx.strokeStyle = star.color;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(star.x - star.radius * 3.5, star.y);
      ctx.lineTo(star.x + star.radius * 3.5, star.y);
      ctx.moveTo(star.x, star.y - star.radius * 3.5);
      ctx.lineTo(star.x, star.y + star.radius * 3.5);
      ctx.stroke();
    }
  }

  // 2. Draw Falling Petals (Sakura for Ghibli, 3D Rose for Cosmic)
  for (const petal of petals) {
    petal.y += petal.vy * delta;
    petal.x += (petal.vx + Math.sin(seconds * 0.8 + petal.phase) * (isGhibli ? 24 : 18)) * delta;
    petal.rotX += petal.vRotX * delta;
    petal.rotY += petal.vRotY * delta;
    petal.rotZ += petal.vRotZ * delta;

    if (finePointer.matches) {
      const dx = petal.x - pointer.sx;
      const dy = petal.y - pointer.sy;
      const dist = Math.hypot(dx, dy);
      if (dist < 120 && dist > 0) {
        petal.x += (dx / dist) * 120 * delta;
        petal.y += (dy / dist) * 60 * delta;
      }
    }

    if (petal.y > height + 30) {
      petal.y = -30;
      petal.x = Math.random() * width;
    }

    if (isGhibli) drawSakuraPetal(petal, seconds);
    else drawRosePetal3D(petal, seconds);
  }

  // 3. Draw Dandelion Fluffs (Ghibli Mode)
  if (isGhibli && dandelions.length) {
    for (const d of dandelions) {
      d.y += d.vy * delta;
      d.x += (d.vx + Math.sin(seconds * 0.6 + d.phase) * 10) * delta;
      if (d.y < -30) {
        d.y = height + 30;
        d.x = Math.random() * width;
      }
      drawDandelion(d, seconds);
    }
  }

  // 4. Draw fairy dust trail particles (emitted by cursor / touch)
  for (let i = trailParticles.length - 1; i >= 0; i--) {
    const tp = trailParticles[i];
    tp.age += delta;
    if (tp.age >= tp.life) {
      trailParticles.splice(i, 1);
      continue;
    }
    tp.x += tp.vx * delta;
    tp.y += tp.vy * delta;
    tp.vy -= 12 * delta;

    const alpha = (1 - tp.age / tp.life) ** 1.8;
    ctx.globalAlpha = alpha;
    if (tp.heart) {
      drawHeart(tp.x, tp.y, tp.size * alpha, tp.age * 2, tp.color);
    } else {
      ctx.fillStyle = tp.color;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, tp.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. Draw burst / firework particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.age += delta;
    if (p.age >= p.life) {
      particles.splice(i, 1);
      continue;
    }
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.vy += 32 * delta;
    p.vx *= (1 - delta * 0.45);

    const alpha = (1 - p.age / p.life) ** 1.5;
    ctx.globalAlpha = alpha;

    if (p.heart) {
      drawHeart(p.x, p.y, p.size, p.rotation + p.age * p.rotSpeed, p.color);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;

  // 6. Parallax 3D tilt & cursor glow interpolation
  if (finePointer.matches && scrollY < height && giftOpened) {
    pointer.sx += (pointer.x - pointer.sx) * 0.055;
    pointer.sy += (pointer.y - pointer.sy) * 0.055;
    root.style.setProperty('--px', pointer.sx.toFixed(1));
    root.style.setProperty('--py', pointer.sy.toFixed(1));

    photoLayers.forEach(layer => {
      const depth = Number(layer.dataset.depth) || 0;
      layer.style.translate = `${((pointer.sx / width) - 0.5) * 24 * depth}px ${((pointer.sy / height) - 0.5) * 20 * depth}px`;
    });
  }

  frameId = requestAnimationFrame(frame);
}

function restartCanvas() {
  cancelAnimationFrame(frameId);
  frameId = 0;
  lastTime = 0;
  if (motionReduced || document.hidden) {
    ctx?.clearRect(0, 0, width, height);
    return;
  }
  frameId = requestAnimationFrame(frame);
}

/* ==========================================================================
   EVENT LISTENERS & INTERACTION BINDINGS
   ========================================================================== */
window.addEventListener('pointermove', event => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;

  if (!motionReduced && giftOpened && Math.random() > 0.45) {
    const isGhibli = currentTheme === 'ghibli';
    trailParticles.push({
      x: event.clientX + (Math.random() - 0.5) * 12,
      y: event.clientY + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 25,
      vy: (Math.random() - 0.5) * 25,
      age: 0,
      life: 0.8 + Math.random() * 0.6,
      size: 2.2 + Math.random() * 3.5,
      heart: Math.random() > 0.75,
      color: isGhibli
        ? (Math.random() > 0.5 ? '#7bed9f' : '#ffe082')
        : (Math.random() > 0.5 ? '#55efc4' : '#38bdf8')
    });
    if (trailParticles.length > 80) trailParticles.shift();
  }
}, { passive: true });

window.addEventListener('resize', resizeCanvas, { passive: true });

let progressFrame = 0;
window.addEventListener('scroll', () => {
  if (!progressFrame) {
    progressFrame = requestAnimationFrame(() => {
      updateProgress();
      progressFrame = 0;
    });
  }
}, { passive: true });

document.addEventListener('visibilitychange', () => {
  root.classList.toggle('page-hidden', document.hidden);
  if (document.hidden) {
    void stopSound();
    particles.length = 0;
    trailParticles.length = 0;
  }
  syncFilm();
  restartCanvas();
});

window.addEventListener('pagehide', () => {
  void stopSound();
  cancelAnimationFrame(frameId);
});

// Hug Button interactive surprise
$('#hug-button')?.addEventListener('click', event => {
  const rect = event.currentTarget.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 130);
  playASMR('heart');

  const msg = $('#final-message');
  if (msg) {
    msg.textContent = currentTheme === 'ghibli'
      ? 'Hôm nay, ngày mai, và mọi mùa hoa nở. Anh thương em, Châu Nhi ngốc xít. 🌸♡'
      : 'Hôm nay, ngày mai, và những ngày sau nữa. Anh thương em, Châu Nhi. ♡';
    msg.classList.add('received');
  }
});

/* ==========================================================================
   SCROLL REVEAL TEXT ENGINE (SMOOTH UP & DOWN TRANSITIONS)
   ========================================================================== */
function initScrollRevealText() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targetSelectors = [
    '.hero-dedication',
    '.hero h1',
    '.hero-description',
    '.hero-signature',
    '.section-top',
    '.section-header',
    '.section h2',
    '.memory-card',
    '.memory-text',
    '.milestone',
    '.gallery-heading',
    '.gallery-photo',
    '.gallery-end',
    '.cinema-star',
    '.cinema h2',
    '.cinema-copy p',
    '.cinema-coordinate',
    '.letter-heart',
    '.letter-heading h2',
    '.letter-heading > p',
    '.letter-paper > h3',
    '.letter-paper > p',
    '.letter-paper blockquote',
    '.letter-signature',
    '.forever-copy h2',
    '.forever-copy > p',
    '.hug-button',
    '.final-message',
    '.site-footer'
  ];

  const elements = document.querySelectorAll(targetSelectors.join(', '));
  elements.forEach((el, index) => {
    el.classList.add('scroll-reveal');
    if (el.matches('.memory-card, .gallery-photo, .milestone, .letter-paper p')) {
      const delay = (index % 4) + 1;
      el.classList.add(`reveal-delay-${delay}`);
    }
  });

  if (isReduced) {
    elements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        const rect = entry.boundingClientRect;
        // Re-arm animation when scrolled out of view above or below
        if (rect.top > window.innerHeight * 0.96 || rect.bottom < -40) {
          entry.target.classList.remove('in-view');
        }
      }
    });
  }, {
    threshold: [0, 0.12, 0.35],
    rootMargin: '0px 0px -25px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   LENIS SMOOTH SCROLL & AFTER EFFECTS GSAP CHOREOGRAPHY
   ========================================================================== */
let lenis = null;
function initLenisSmoothScroll() {
  if (typeof Lenis === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } catch (e) {
    console.warn('Lenis scroll init:', e);
  }
}

function animateHeroFanOut() {
  if (typeof gsap === 'undefined' || motionReduced) return;
  const heroSection = $('#home');
  if (!heroSection) return;
  const heroFigures = heroSection.querySelectorAll('figure');
  const heroHeading = heroSection.querySelector('h1');

  if (heroFigures.length >= 3) {
    gsap.fromTo(
      heroFigures,
      {
        y: 75,
        rotation: 0,
        scale: 0.85,
        opacity: 0,
        filter: 'blur(8px)',
      },
      {
        y: 0,
        rotation: (i) => (i === 0 ? -6 : i === 1 ? 4 : -2),
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.6,
        stagger: 0.18,
        ease: 'expo.out',
        delay: 0.3,
      }
    );

    // 3D Parallax Mouse Tilt on Desktop
    heroSection.addEventListener('mousemove', (e) => {
      if (motionReduced || window.innerWidth < 768) return;
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

      heroFigures.forEach((fig, idx) => {
        const depth = (idx + 1) * 12;
        gsap.to(fig, {
          x: xNorm * depth,
          y: yNorm * depth,
          rotationY: xNorm * 7,
          rotationX: -yNorm * 7,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    });
  }

  if (heroHeading && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo(
      heroHeading,
      {
        y: 55,
        opacity: 0,
        rotationX: -32,
        skewY: 3,
        filter: 'blur(6px)',
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        skewY: 0,
        filter: 'blur(0px)',
        duration: 1.4,
        ease: 'expo.out',
        delay: 0.2
      }
    );

    gsap.to(heroHeading, {
      yPercent: -25,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}

function initAEMotionGraphics() {
  if (typeof gsap === 'undefined' || motionReduced) return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const sections = document.querySelectorAll('main > section');
  const heroSection = sections[0];
  const memoriesSection = sections[1];
  const videoSection = sections[2];
  const gallerySection = sections[3];
  const letterSection = sections[4];

  // A. KINETIC TYPOGRAPHY FOR ALL MAIN H2 HEADINGS
  document.querySelectorAll('main section h2').forEach((h2) => {
    gsap.fromTo(
      h2,
      {
        y: 55,
        opacity: 0,
        rotationX: -32,
        skewY: 3,
        transformOrigin: '50% 100%',
        filter: 'blur(6px)',
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        skewY: 0,
        filter: 'blur(0px)',
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: h2,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // B. CHƯƠNG 01: CLIP-PATH CURTAIN REVEAL & STAGGERED PARALLAX
  if (memoriesSection) {
    const memFigures = memoriesSection.querySelectorAll('figure');
    memFigures.forEach((fig, index) => {
      const img = fig.querySelector('img');

      gsap.fromTo(
        fig,
        { clipPath: 'inset(18% 8% 18% 8% round 24px)', y: 45 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 16px)',
          y: 0,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: fig,
            start: 'top 85%',
          },
        }
      );

      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.22, yPercent: -8 },
          {
            scale: 1,
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: fig,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      gsap.to(fig, {
        y: index % 2 === 0 ? -30 : 25,
        ease: 'none',
        scrollTrigger: {
          trigger: memoriesSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  // C. VIDEO INTERLUDE: SCROLL-SCRUBBED IRIS / ARCH CLIP-PATH
  if (videoSection) {
    const videoEl = videoSection.querySelector('video');
    const videoText = videoSection.querySelector('.cinema-copy') || videoSection.querySelector('div:last-of-type');

    gsap.fromTo(
      videoSection,
      {
        clipPath: 'inset(12% 14% 12% 14% round 160px)',
      },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: videoSection,
          start: 'top 85%',
          end: 'top 15%',
          scrub: 0.8,
        },
      }
    );

    if (videoEl) {
      gsap.fromTo(
        videoEl,
        { scale: 1.25 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: videoSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    if (videoText) {
      gsap.fromTo(
        videoText,
        { y: 50, opacity: 0, scale: 0.94, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: videoSection,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }

  // D. CHƯƠNG 02 (17 KHUNG HÌNH): VELOCITY SKEW INERTIA
  if (gallerySection) {
    let proxy = { skew: 0 };
    let skewSetter = gsap.quickSetter(gallerySection, 'skewY', 'deg');
    let clamp = gsap.utils.clamp(-3.5, 3.5);

    ScrollTrigger.create({
      trigger: gallerySection,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -450);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: 'power3',
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew),
          });
        }
      },
    });
  }

  // E. CHƯƠNG 03 (LÁ THƯ): 3D FOLD-UP & SVG TRIM-PATH SIGNATURE
  if (letterSection) {
    const article = letterSection.querySelector('article');
    if (article) {
      const paragraphs = article.querySelectorAll('p, blockquote');
      const signature = article.querySelector('.letter-signature') || article.querySelector('div:last-of-type');

      gsap.fromTo(
        article,
        { y: 65, rotationX: 12, opacity: 0, transformPerspective: 1200 },
        {
          y: 0,
          rotationX: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: article,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        paragraphs,
        { y: 22, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: article,
            start: 'top 72%',
          },
        }
      );

      if (signature) {
        signature.classList.add('ae-signature-line');
        gsap.fromTo(
          signature,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0.3 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 1.8,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: signature,
              start: 'top 90%',
              onEnter: () => signature.classList.add('is-drawn'),
            },
          }
        );
      }
    }
  }

  // F. MARQUEE VELOCITY ACCELERATION & REVERSAL
  if (lenis) {
    const ribbonContainer = document.querySelector('.love-ribbon > div');
    if (ribbonContainer) {
      let offset = 0;
      lenis.on('scroll', (e) => {
        const vel = e.velocity || 0;
        offset += vel * 0.15;
        ribbonContainer.style.transform = `translateX(${offset % 400}px)`;
      });
    }
  }
}

/* ==========================================================================
   DESKTOP MAGNETIC STARLIGHT CURSOR
   ========================================================================== */
function initMagneticCursor() {
  const dot = document.querySelector('.ae-cursor-dot');
  const ring = document.querySelector('.ae-cursor-ring');
  if (!dot || !ring || !finePointer.matches || motionReduced) return;

  let cx = innerWidth / 2;
  let cy = innerHeight / 2;
  let rx = cx;
  let ry = cy;

  window.addEventListener('pointermove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    dot.style.transform = `translate(${cx}px, ${cy}px)`;
  }, { passive: true });

  function updateCursorRing() {
    rx += (cx - rx) * 0.15;
    ry += (cy - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(updateCursorRing);
  }
  requestAnimationFrame(updateCursorRing);

  document.querySelectorAll('.gallery-photo, .memory-photo, .hero-photo, .hug-button').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('is-hovering-photo');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('is-hovering-photo');
    });
  });
}

// Initialize on load
applyTheme(currentTheme, false);
resizeCanvas();
setMotion();
updateProgress();
syncSoundLabels();
initPhotoTiltEffects();
initScrollRevealText();
initLenisSmoothScroll();
initAEMotionGraphics();
initMagneticCursor();

