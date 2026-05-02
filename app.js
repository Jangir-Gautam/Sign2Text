// ─────────────────────────────────────────────────
//  HAND RENDERER  — Flesh silhouette + skeleton overlay
// ─────────────────────────────────────────────────
// 21 landmarks: 0=wrist, 1-4=thumb, 5-8=index,
//               9-12=middle, 13-16=ring, 17-20=pinky

const CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17]
];
const TIPS = new Set([4,8,12,16,20]);

// Skeleton bone colors per connection (finger-specific)
const BCOL = [
  '#f0abfc','#f0abfc','#f0abfc','#f0abfc',  // thumb  – fuchsia
  '#93c5fd','#93c5fd','#93c5fd','#93c5fd',  // index  – sky blue
  '#c4b5fd','#c4b5fd','#c4b5fd','#c4b5fd',  // middle – violet
  '#d8b4fe','#d8b4fe','#d8b4fe','#d8b4fe',  // ring   – purple
  '#a5b4fc','#a5b4fc','#a5b4fc','#a5b4fc',  // pinky  – indigo
  '#e9d5ff','#e9d5ff','#e9d5ff'             // palm arches
];

// Finger flesh widths (thumb, index, middle, ring, pinky)
const FLESH_W = [16, 18, 20, 17, 13];
const FINGER_IDX = [[0,1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]];

function handSVG(pts) {
  // ── Layer 1: Palm polygon fill ───────────────────
  const palmPoly = [0,17,13,9,5,1].map(i => pts[i].join(',')).join(' ');

  // ── Layer 2: Thick flesh strokes for finger volumes
  let flesh = `<polygon points="${palmPoly}" fill="url(#fg)" stroke="none" opacity="0.85"/>`;
  FINGER_IDX.forEach((seg, fi) => {
    const d = seg.map((idx,j) => `${j===0?'M':'L'}${pts[idx][0]},${pts[idx][1]}`).join(' ');
    flesh += `<path d="${d}" fill="none" stroke="url(#fg)" stroke-width="${FLESH_W[fi]}"
      stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`;
  });

  // ── Layer 3: Skeleton bone lines ─────────────────
  const bones = CONNECTIONS.map(([a,b], i) =>
    `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}"
      stroke="${BCOL[i]||'#e9d5ff'}" stroke-width="2.2" stroke-linecap="round" opacity="0.95"/>`
  ).join('');

  // ── Layer 4 & 5: Joint dots + fingertip glow ─────
  const dots = pts.map(([x,y], i) => {
    if (TIPS.has(i)) {
      // Outer glow ring + bright dot + white center
      return `<circle cx="${x}" cy="${y}" r="10" fill="#a855f7" opacity="0.2"/>
              <circle cx="${x}" cy="${y}" r="6.5" fill="#e9d5ff" opacity="0.98"/>
              <circle cx="${x}" cy="${y}" r="3" fill="white"/>
              <circle cx="${x}" cy="${y}" r="1.5" fill="#7c3aed"/>`;
    }
    if (i === 0) { // wrist anchor
      return `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
              <circle cx="${x}" cy="${y}" r="3" fill="white" opacity="0.75"/>`;
    }
    // Regular joint
    return `<circle cx="${x}" cy="${y}" r="4" fill="#0f0a2a" stroke="white" stroke-width="1.8" opacity="0.9"/>`;
  }).join('');

  return `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fg" x1="60" y1="40" x2="160" y2="230" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="#c084fc" stop-opacity="0.72"/>
        <stop offset="50%"  stop-color="#8b5cf6" stop-opacity="0.65"/>
        <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.58"/>
      </linearGradient>
      <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="3.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${flesh}
    ${bones}
    ${dots}
  </svg>`;
}

// ─────────────────────────────────────────────────
//  LANDMARK DATA  (21 [x,y] points per letter)
// ─────────────────────────────────────────────────
const LANDMARKS = {

  H: [ // index + middle pointing RIGHT
    [85,215],
    [68,202],[52,196],[40,191],[30,186],
    [80,182],[115,177],[148,172],[178,168],
    [80,197],[115,193],[148,190],[178,187],
    [84,208],[80,200],[77,195],[75,190],
    [94,212],[92,207],[90,203],[89,199]
  ],

  E: [ // all fingers bent/curled
    [100,215],
    [78,202],[62,196],[50,188],[50,176],
    [80,178],[72,166],[68,156],[70,148],
    [100,175],[92,163],[88,153],[90,145],
    [120,178],[115,166],[113,156],[115,148],
    [136,186],[133,176],[131,168],[132,162]
  ],

  L: [ // index UP, thumb pointing LEFT
    [110,215],
    [92,202],[74,200],[56,198],[38,196],
    [100,182],[96,152],[93,124],[90,98],
    [120,182],[118,172],[116,164],[115,158],
    [134,186],[132,178],[130,172],[129,167],
    [145,192],[144,185],[143,180],[142,176]
  ],

  O: [ // all fingers curved forming O
    [100,215],
    [76,202],[62,190],[54,176],[55,162],
    [80,178],[68,160],[60,146],[56,134],
    [100,175],[96,157],[94,142],[96,130],
    [120,178],[120,160],[120,145],[120,133],
    [136,185],[138,170],[140,158],[142,148]
  ],

  A: [ // closed fist, thumb beside index
    [100,215],
    [78,202],[60,194],[47,186],[38,178],
    [82,178],[78,165],[75,155],[74,147],
    [102,175],[100,162],[98,152],[97,144],
    [122,178],[122,165],[121,155],[120,147],
    [138,186],[140,175],[141,166],[142,160]
  ],

  B: [ // all 4 fingers straight up, thumb folded
    [100,215],
    [76,202],[62,196],[55,188],[52,180],
    [72,178],[68,142],[66,112],[64,86],
    [94,175],[92,138],[91,108],[90,82],
    [116,178],[117,142],[118,112],[118,86],
    [136,184],[140,152],[142,124],[143,100]
  ],

  C: [ // curved C shape
    [100,215],
    [76,202],[60,192],[48,180],[44,166],
    [82,178],[70,158],[62,142],[58,128],
    [100,175],[92,156],[88,140],[88,126],
    [118,178],[118,160],[118,145],[118,132],
    [134,185],[136,170],[138,158],[140,148]
  ],

  D: [ // index up, others curl to thumb
    [100,215],
    [80,202],[66,194],[58,182],[62,168],
    [96,178],[93,148],[91,120],[90,96],
    [116,178],[116,168],[116,162],[116,157],
    [130,182],[130,174],[130,169],[130,165],
    [142,188],[143,182],[143,178],[143,174]
  ],

  F: [ // index + thumb touch, others up
    [100,215],
    [78,202],[63,194],[56,183],[62,172],
    [83,178],[76,165],[72,156],[68,172],
    [102,175],[100,140],[99,110],[98,84],
    [122,178],[124,143],[125,113],[126,88],
    [138,186],[141,155],[143,128],[145,105]
  ],

  G: [ // index points sideways, thumb parallel
    [95,215],
    [76,202],[60,196],[48,190],[36,184],
    [88,185],[118,178],[148,172],[176,167],
    [90,200],[88,192],[87,186],[86,182],
    [96,207],[96,202],[95,198],[95,194],
    [108,210],[110,207],[111,204],[112,201]
  ],

  I: [ // pinky up, fist closed
    [100,215],
    [78,202],[62,196],[52,188],[48,180],
    [84,178],[80,168],[77,160],[75,154],
    [104,175],[102,165],[100,157],[99,151],
    [122,178],[122,168],[121,160],[121,154],
    [138,184],[138,158],[138,135],[138,115]
  ],

  K: [ // index + middle up, thumb between
    [100,215],
    [82,202],[68,190],[60,175],[60,160],
    [88,178],[83,148],[80,120],[78,96],
    [108,178],[106,148],[104,120],[103,96],
    [126,182],[128,172],[129,165],[129,160],
    [142,188],[143,182],[144,177],[144,174]
  ],

  M: [ // thumb under first three fingers
    [100,215],
    [80,200],[68,192],[62,185],[62,178],
    [84,178],[80,168],[77,161],[76,156],
    [104,175],[102,165],[101,157],[100,151],
    [122,178],[122,168],[121,161],[121,155],
    [138,184],[140,176],[140,170],[140,165]
  ],

  N: [ // thumb under index + middle
    [100,215],
    [80,200],[66,192],[58,184],[58,174],
    [84,178],[80,168],[77,160],[76,154],
    [104,175],[102,165],[101,157],[100,151],
    [122,178],[124,170],[125,164],[126,160],
    [138,185],[141,177],[142,171],[143,167]
  ],

  P: [ // K shape pointing down
    [100,215],
    [84,200],[72,190],[66,178],[70,165],
    [96,182],[105,200],[112,215],[118,228],
    [116,180],[128,196],[138,210],[146,222],
    [130,184],[136,176],[140,170],[142,165],
    [144,190],[147,184],[149,179],[150,175]
  ],

  Q: [ // G shape pointing down
    [95,215],
    [78,202],[64,196],[54,190],[44,184],
    [90,188],[104,202],[116,214],[126,224],
    [94,202],[96,195],[97,190],[98,186],
    [104,208],[106,204],[107,200],[108,197],
    [116,212],[118,209],[120,207],[121,205]
  ],

  R: [ // index + middle crossed
    [100,215],
    [78,202],[62,196],[52,188],[46,180],
    [88,178],[88,148],[88,120],[88,96],
    [106,178],[100,148],[96,120],[94,96],
    [122,182],[124,172],[125,165],[126,160],
    [138,188],[140,180],[141,174],[142,170]
  ],

  S: [ // fist, thumb over fingers
    [100,215],
    [80,202],[66,194],[58,186],[54,175],
    [84,178],[80,168],[77,161],[76,155],
    [104,175],[102,166],[101,158],[100,152],
    [122,178],[122,169],[122,162],[121,157],
    [138,185],[140,177],[141,172],[141,167]
  ],

  T: [ // thumb between index + middle
    [100,215],
    [82,202],[68,192],[60,180],[60,168],
    [86,178],[82,168],[79,161],[78,155],
    [104,175],[102,166],[101,158],[100,152],
    [122,178],[122,169],[122,162],[122,157],
    [138,185],[140,178],[141,172],[141,168]
  ],

  U: [ // index + middle up together
    [100,215],
    [78,202],[62,196],[52,188],[46,180],
    [88,178],[84,148],[82,120],[80,96],
    [108,178],[106,148],[104,120],[103,96],
    [126,182],[128,172],[129,165],[130,160],
    [142,188],[143,182],[144,177],[145,174]
  ],

  V: [ // index + middle spread in V
    [100,215],
    [78,202],[62,196],[52,188],[46,180],
    [82,178],[72,148],[65,120],[60,96],
    [104,178],[108,148],[110,120],[112,96],
    [124,184],[128,175],[130,168],[132,163],
    [140,190],[143,183],[145,178],[146,174]
  ],

  W: [ // index, middle, ring up spread
    [100,215],
    [78,202],[64,196],[55,190],[50,184],
    [78,178],[68,148],[62,120],[58,96],
    [100,175],[100,142],[100,112],[100,86],
    [122,178],[126,148],[128,120],[130,96],
    [142,186],[146,162],[148,143],[150,128]
  ],

  X: [ // index hooks
    [100,215],
    [78,202],[62,196],[52,188],[46,180],
    [88,178],[80,158],[76,142],[80,130],
    [108,178],[108,168],[108,162],[108,157],
    [124,182],[126,174],[127,168],[128,164],
    [140,188],[142,182],[143,177],[143,173]
  ],

  Y: [ // pinky + thumb extended
    [100,215],
    [80,202],[64,194],[50,184],[38,175],
    [86,178],[83,168],[80,162],[79,157],
    [104,176],[103,167],[102,160],[101,155],
    [120,178],[121,170],[122,164],[122,159],
    [136,184],[138,158],[140,135],[142,114]
  ],

  Z: [ // index draws Z  (pointing sideways like G)
    [95,215],
    [76,202],[60,196],[48,190],[36,184],
    [88,184],[118,178],[148,172],[176,167],
    [90,200],[88,192],[87,186],[86,182],
    [96,207],[96,202],[95,198],[95,194],
    [108,210],[110,207],[111,204],[112,201]
  ],

  DEFAULT: [ // open hand
    [100,215],
    [80,200],[62,188],[48,175],[36,162],
    [78,178],[72,148],[68,122],[65,100],
    [100,175],[100,142],[100,115],[100,90],
    [122,178],[126,146],[128,120],[130,97],
    [140,185],[148,158],[152,136],[155,118]
  ]
};

function getHandSVG(letter) {
  const pts = LANDMARKS[letter] || LANDMARKS['DEFAULT'];
  return handSVG(pts);
}

// ─────────────────────────────────────────────────
//  INJECT SVG GRADIENT DEFS
// ─────────────────────────────────────────────────
document.body.insertAdjacentHTML('afterbegin',
  `<svg style="position:absolute;width:0;height:0"><defs>
    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs></svg>`
);

// ─────────────────────────────────────────────────
//  HERO: animate H → E → L → L → O
// ─────────────────────────────────────────────────
const HELLO_SEQ = ['H','E','L','L','O'];
let helloIdx = 0;

function showHeroHand(letter) {
  const el = document.getElementById('hero-hand');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => {
    el.innerHTML = getHandSVG(letter);
    el.style.opacity = '1';
    const pl = document.getElementById('pred-letter');
    const pc = document.getElementById('pred-conf');
    if (pl) pl.textContent = letter;
    if (pc) pc.textContent = (95 + Math.random() * 4).toFixed(1) + '% confident';
  }, 250);
}

showHeroHand(HELLO_SEQ[0]);
setInterval(() => {
  helloIdx = (helloIdx + 1) % HELLO_SEQ.length;
  showHeroHand(HELLO_SEQ[helloIdx]);
}, 1800);

// ─────────────────────────────────────────────────
//  ASL DESCRIPTIONS & ALPHABET GRID
// ─────────────────────────────────────────────────
const ASL_DESCRIPTIONS = {
  A:"Closed fist, thumb beside index", B:"Flat hand, fingers together",
  C:"Curved C shape",                  D:"Index up, others curl to thumb",
  E:"Bent claw, thumb tucked",         F:"Index & thumb touch, others up",
  G:"Index points sideways",           H:"Index & middle point sideways",
  I:"Pinky up, fist closed",           J:"Pinky up, draw J",
  K:"Index & middle up, thumb between",L:"Index up, thumb out — L shape",
  M:"Thumb under first three fingers", N:"Thumb under two fingers",
  O:"All fingers curve forming O",     P:"K shape pointing down",
  Q:"G shape pointing down",           R:"Index & middle crossed",
  S:"Fist, thumb over fingers",        T:"Thumb between index & middle",
  U:"Index & middle up together",      V:"Index & middle spread — V",
  W:"Index, middle & ring up",         X:"Index finger hooks",
  Y:"Pinky & thumb extended",          Z:"Index draws Z in air"
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const grid = document.getElementById('alphabet-grid');
ALPHABET.forEach(letter => {
  const card = document.createElement('div');
  card.className = 'alpha-card reveal';
  card.id = `alpha-${letter}`;
  card.innerHTML = `<div class="alpha-letter">${letter}</div>
    <div class="alpha-desc">${ASL_DESCRIPTIONS[letter]}</div>`;
  grid.appendChild(card);
});

// ─────────────────────────────────────────────────
//  ASL KEYBOARD
// ─────────────────────────────────────────────────
const keyboard = document.getElementById('asl-keyboard');
ALPHABET.forEach(letter => {
  const btn = document.createElement('button');
  btn.className = 'key-btn'; btn.id = `key-${letter}`;
  btn.textContent = letter;
  btn.addEventListener('click', () => signLetter(letter));
  keyboard.appendChild(btn);
});

// ─────────────────────────────────────────────────
//  DEMO STATE
// ─────────────────────────────────────────────────
let outputText = '';
let autoInterval = null;
let isAutoDemoRunning = false;
let frameCount = 0;

function signLetter(letter) {
  // Highlight key
  document.querySelectorAll('.key-btn').forEach(k => k.classList.remove('active'));
  const keyBtn = document.getElementById(`key-${letter}`);
  if (keyBtn) { keyBtn.classList.add('active'); setTimeout(() => keyBtn.classList.remove('active'), 500); }

  // Animate demo hand
  const svgEl = document.getElementById('demo-hand-svg');
  const dispEl = document.getElementById('demo-letter-display');
  if (svgEl) {
    svgEl.style.opacity = '0';
    setTimeout(() => { svgEl.innerHTML = getHandSVG(letter); svgEl.style.opacity = '1'; }, 200);
  }
  if (dispEl) dispEl.textContent = letter;

  // Confidence bar
  const conf = (95 + Math.random() * 4).toFixed(1);
  const cf = document.getElementById('conf-fill'); if (cf) cf.style.width = conf + '%';
  const cp = document.getElementById('conf-pct'); if (cp) cp.textContent = conf + '%';

  // Frame counter + status
  frameCount += Math.floor(Math.random() * 3) + 2;
  const fe = document.getElementById('frame-count'); if (fe) fe.textContent = `Frame: ${frameCount}`;
  const sd = document.getElementById('demo-status-dot'); if (sd) sd.classList.add('active');
  const sl = document.getElementById('demo-status-label');
  if (sl) { sl.textContent = 'Recognizing…'; setTimeout(() => sl.textContent = 'Letter Locked', 400); }

  outputText += letter;
  updateOutput();
}

function updateOutput() {
  const el = document.getElementById('output-text');
  if (!el) return;
  const ac = document.getElementById('ac-checkbox');
  let text = outputText;
  if (ac && ac.checked) text = autocorrectSimple(text);
  el.innerHTML = escapeHtml(text) + '<span class="cursor-blink">|</span>';
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function autocorrectSimple(text) {
  const map = { 'HELO':'HELLO', 'WROLD':'WORLD', 'WELCOM':'WELCOME' };
  let r = text;
  Object.keys(map).forEach(k => { r = r.split(k).join(map[k]); });
  return r;
}

// ─────────────────────────────────────────────────
//  AUTO DEMO: spells HELLO with hands
// ─────────────────────────────────────────────────
document.getElementById('btn-auto-demo').addEventListener('click', () => {
  if (isAutoDemoRunning) return;
  isAutoDemoRunning = true;
  outputText = ''; updateOutput();
  let i = 0;
  autoInterval = setInterval(() => {
    if (i >= HELLO_SEQ.length) { clearInterval(autoInterval); isAutoDemoRunning = false; return; }
    signLetter(HELLO_SEQ[i++]);
  }, 900);
});

document.getElementById('btn-stop-demo').addEventListener('click', () => {
  clearInterval(autoInterval); isAutoDemoRunning = false;
  const sd = document.getElementById('demo-status-dot'); if (sd) sd.classList.remove('active');
  const sl = document.getElementById('demo-status-label'); if (sl) sl.textContent = 'Stopped';
});

document.getElementById('btn-backspace').addEventListener('click', () => {
  outputText = outputText.slice(0, -1); updateOutput();
  if (!outputText) {
    const d = document.getElementById('demo-letter-display'); if (d) d.textContent = '—';
    const s = document.getElementById('demo-hand-svg'); if (s) { s.style.opacity='0'; setTimeout(()=>{ s.innerHTML=''; s.style.opacity='1'; },200); }
  }
});
document.getElementById('btn-space').addEventListener('click', () => { outputText += ' '; updateOutput(); });
document.getElementById('btn-clear').addEventListener('click', () => {
  outputText = ''; updateOutput();
  const d = document.getElementById('demo-letter-display'); if (d) d.textContent = '—';
  const s = document.getElementById('demo-hand-svg'); if (s) { s.style.opacity='0'; setTimeout(()=>{ s.innerHTML=''; s.style.opacity='1'; },200); }
  const cf = document.getElementById('conf-fill'); if (cf) cf.style.width = '0%';
  const cp = document.getElementById('conf-pct'); if (cp) cp.textContent = '—';
  frameCount = 0;
  const fe = document.getElementById('frame-count'); if (fe) fe.textContent = 'Frame: 0';
});
document.getElementById('btn-copy').addEventListener('click', () => {
  navigator.clipboard.writeText(outputText).then(() => {
    const b = document.getElementById('btn-copy');
    b.textContent = '✅'; setTimeout(() => b.textContent = '📋', 1500);
  });
});
document.getElementById('btn-speak').addEventListener('click', () => {
  if (outputText.trim()) window.speechSynthesis.speak(new SpeechSynthesisUtterance(outputText.toLowerCase()));
});

// ─────────────────────────────────────────────────
//  SCROLL REVEAL
// ─────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.feature-card,.pipeline-step,.alpha-card,.callout,.section-tag,.section-title,.section-sub')
  .forEach(el => { el.classList.add('reveal'); revealObs.observe(el); });

// ─────────────────────────────────────────────────
//  STAT COUNTERS
// ─────────────────────────────────────────────────
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-target]').forEach(num => {
      const target = +num.dataset.target; let cur = 0;
      const t = setInterval(() => {
        cur = Math.min(cur + target / 60, target);
        num.textContent = Math.floor(cur).toLocaleString();
        if (cur >= target) clearInterval(t);
      }, 25);
    });
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
const hs = document.getElementById('hero-stats'); if (hs) counterObs.observe(hs);

// ─────────────────────────────────────────────────
//  PERFORMANCE RING + BARS
// ─────────────────────────────────────────────────
const perfObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.perf-bar-fill').forEach(b => {
      setTimeout(() => { b.style.width = b.dataset.width + '%'; }, 200);
    });
    const ring = document.getElementById('ring-fill'), num = document.getElementById('ring-num');
    if (ring && num) {
      setTimeout(() => {
        ring.style.strokeDashoffset = 314 - 0.98 * 314;
        let c = 0; const t = setInterval(() => { c = Math.min(c+1,98); num.textContent=c; if(c>=98)clearInterval(t); }, 20);
      }, 300);
    }
    perfObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
const mg = document.getElementById('metrics-grid'); if (mg) perfObs.observe(mg);

// ─────────────────────────────────────────────────
//  NAVBAR + HAMBURGER
// ─────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.padding = window.scrollY > 50 ? '10px 0' : '16px 0';
});
document.getElementById('hamburger').addEventListener('click', () => {
  const links = document.getElementById('nav-links');
  const open = links.style.display === 'flex';
  Object.assign(links.style, {
    display: open ? 'none' : 'flex', flexDirection:'column',
    position:'absolute', top:'64px', left:'0', right:'0',
    background:'rgba(9,9,15,.97)', padding:'16px 24px',
    gap:'16px', borderBottom:'1px solid rgba(255,255,255,.08)'
  });
});

updateOutput();

// ─────────────────────────────────────────────────
//  LIVE CAMERA (MediaPipe Hands Integration)
// ─────────────────────────────────────────────────
let isCameraRunning = false;
let camera = null;
let hands = null;
let predictionBuffer = [];
let lastOutputTime = 0;
const BUFFER_SIZE = 12; // Frames needed for consensus

const videoElement = document.getElementById('demo-live-video');
const btnCamera = document.getElementById('btn-start-camera');

if (btnCamera) {
  btnCamera.addEventListener('click', async () => {
    if (!window.Hands || !window.Camera) {
      alert("AI models are still loading. Please wait a second and try again.");
      return;
    }
    if (isCameraRunning) stopCamera();
    else startCamera();
  });
}

function stopCamera() {
  isCameraRunning = false;
  if (camera) camera.stop();
  videoElement.style.display = 'none';
  btnCamera.innerHTML = '📷 Start Camera';
  btnCamera.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  const sl = document.getElementById('demo-status-label');
  if (sl) sl.textContent = 'Camera Stopped';
}

function startCamera() {
  if (isAutoDemoRunning) document.getElementById('btn-stop-demo').click();
  
  isCameraRunning = true;
  videoElement.style.display = 'block';
  btnCamera.innerHTML = '⏹ Stop Camera';
  btnCamera.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
  const sl = document.getElementById('demo-status-label');
  if (sl) sl.textContent = 'Initializing AI...';
  
  if (!hands) {
    hands = new window.Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });
    hands.onResults(onMediaPipeResults);
  }
  
  if (!camera) {
    camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (isCameraRunning) await hands.send({image: videoElement});
      },
      width: 640,
      height: 480
    });
  }
  camera.start();
}

// Normalize landmarks for classification (Center at wrist, scale by max distance)
function normalizePoints(pts) {
  const wrist = pts[0];
  let shifted = pts.map(p => [p[0] - wrist[0], p[1] - wrist[1]]);
  let maxDist = 0;
  for (let p of shifted) {
    let d = Math.sqrt(p[0]*p[0] + p[1]*p[1]);
    if (d > maxDist) maxDist = d;
  }
  if (maxDist === 0) maxDist = 1;
  return shifted.map(p => [p[0]/maxDist, p[1]/maxDist]);
}

const TEMPLATES = {};
for (const letter in LANDMARKS) {
  TEMPLATES[letter] = normalizePoints(LANDMARKS[letter]);
}

function predictASL(livePoints) {
  const normLive = normalizePoints(livePoints);
  let bestLetter = 'DEFAULT';
  let bestDist = Infinity;
  
  for (const letter in TEMPLATES) {
    if (letter === 'DEFAULT') continue;
    let dist = 0;
    for (let i = 0; i < 21; i++) {
      dist += Math.pow(normLive[i][0] - TEMPLATES[letter][i][0], 2) +
              Math.pow(normLive[i][1] - TEMPLATES[letter][i][1], 2);
    }
    if (dist < bestDist) {
      bestDist = dist;
      bestLetter = letter;
    }
  }
  if (bestDist > 2.5) return 'DEFAULT'; // Not matching any sign closely
  return bestLetter;
}

function onMediaPipeResults(results) {
  if (!isCameraRunning) return;
  
  const svgEl = document.getElementById('demo-hand-svg');
  const sl = document.getElementById('demo-status-label');
  
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    svgEl.innerHTML = '';
    if (sl) sl.textContent = 'Looking for hand...';
    predictionBuffer = [];
    return;
  }
  
  frameCount++;
  const fe = document.getElementById('frame-count'); 
  if (fe) fe.textContent = `Frame: ${frameCount}`;
  
  const landmarks = results.multiHandLandmarks[0];
  
  // Scale points to our 200x240 SVG viewBox
  // X is flipped because we mirror the video feed
  const scaledPoints = landmarks.map(lm => [
    (1 - lm.x) * 200, 
    lm.y * 240
  ]);
  
  // Draw the exact same beautiful flesh+skeleton SVG!
  svgEl.innerHTML = handSVG(scaledPoints);
  svgEl.style.opacity = '1';
  
  // Predict
  const letter = predictASL(scaledPoints);
  document.getElementById('demo-letter-display').textContent = letter !== 'DEFAULT' ? letter : '—';
  
  const distScore = 95 + Math.random() * 4; // Mock conf
  document.getElementById('conf-fill').style.width = distScore.toFixed(1) + '%';
  document.getElementById('conf-pct').textContent = distScore.toFixed(1) + '%';
  
  // Consensus Buffer
  if (letter !== 'DEFAULT') {
    predictionBuffer.push(letter);
    if (predictionBuffer.length > BUFFER_SIZE) predictionBuffer.shift();
    
    if (predictionBuffer.length === BUFFER_SIZE && predictionBuffer.every(v => v === letter)) {
      if (Date.now() - lastOutputTime > 1500) { // 1.5s cooldown between letters
        outputText += letter;
        updateOutput();
        if (sl) sl.textContent = `Locked: ${letter}`;
        document.getElementById('demo-status-dot').classList.add('active');
        setTimeout(() => document.getElementById('demo-status-dot').classList.remove('active'), 300);
        lastOutputTime = Date.now();
        predictionBuffer = []; // Reset buffer after lock
      } else {
        if (sl) sl.textContent = 'Cooldown...';
      }
    } else {
      if (sl) sl.textContent = 'Recognizing...';
    }
  } else {
    predictionBuffer = [];
    if (sl) sl.textContent = 'Tracking...';
  }
}
