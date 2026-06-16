/* ============================================
   HAPPY BIRTHDAY AKKU — SCRIPT
   all the interactive magic ✨
   ============================================ */

/* ============================================
   1. HERO TITLE — letter animation
   ============================================ */
(function(){
  const t = document.getElementById('title');
  const txt = t.textContent;
  t.innerHTML = '';
  let delay = 0.3;
  for(const ch of txt){
    const s = document.createElement('span');
    s.className = 'letter';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.animationDelay = delay + 's';
    delay += 0.07;
    t.appendChild(s);
  }
})();

/* ============================================
   2. SOFT AUDIO FEEDBACK (Web Audio)
   ============================================ */
let audioCtx = null;
function getAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playSound(kind){
  try{
    const ctx = getAudio();
    const now = ctx.currentTime;
    if(kind === 'pop'){
      // bubble pop: short rising sine then quick fall
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(400, now);
      o.frequency.exponentialRampToValueAtTime(900, now + 0.05);
      o.frequency.exponentialRampToValueAtTime(150, now + 0.18);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.2, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      o.connect(g).connect(ctx.destination);
      o.start(now); o.stop(now + 0.2);
    } else if(kind === 'sparkle'){
      // bright bell-like
      [1, 1.5, 2].forEach((mult, i)=>{
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(800*mult, now);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.08, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        o.connect(g).connect(ctx.destination);
        o.start(now + i*0.02);
        o.stop(now + 0.4 + i*0.02);
      });
    } else if(kind === 'tap'){
      // soft click
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(600, now);
      o.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.1, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      o.connect(g).connect(ctx.destination);
      o.start(now); o.stop(now + 0.1);
    } else if(kind === 'whoosh'){
      // air swoosh for cake blow
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate*0.3, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for(let i=0;i<data.length;i++) data[i] = (Math.random()*2-1) * (1 - i/data.length);
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      noise.connect(filter).connect(g).connect(ctx.destination);
      noise.start(now);
    } else if(kind === 'kiss'){
      // muah - high quick squeak
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(900, now);
      o.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      o.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.15, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      o.connect(g).connect(ctx.destination);
      o.start(now); o.stop(now + 0.25);
    }
  }catch(e){/* audio not allowed yet */}
}

/* ============================================
   3. LOVE METER
   ============================================ */
const loveMeter = document.getElementById('loveMeter');
const lmFill = document.getElementById('lmFill');
const lmPercent = document.getElementById('lmPercent');
let lovePoints = 0;
let maxedFired = false;
const LOVE_MAX = 100;
function addLove(pts){
  lovePoints = Math.min(LOVE_MAX, lovePoints + pts);
  const pct = Math.round((lovePoints/LOVE_MAX)*100);
  lmFill.style.width = pct + '%';
  lmPercent.textContent = pct + '%';
  if(pct >= 100 && !maxedFired){
    maxedFired = true;
    loveMeter.classList.add('maxed');
    lmPercent.textContent = '∞';
    confettiBurst(150);
    playSound('sparkle');
    setTimeout(()=>showEasterBanner('💖 love-o-meter MAXED out! 💖<br><span style="font-size:1rem;font-family:Quicksand;font-weight:600">just like my love for you, akku</span>'), 300);
  }
}
// reveal meter after a moment
setTimeout(()=>loveMeter.classList.add('show'), 1500);

/* ============================================
   4. SCROLL PROGRESS BAR
   ============================================ */
const scrollProg = document.getElementById('scrollProgress');
function updateScrollProgress(){
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  scrollProg.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, {passive: true});

/* ============================================
   5. PARALLAX BACKGROUND SHAPES
   ============================================ */
const bgShapes = document.querySelectorAll('.bg-shape');
function updateParallax(){
  const y = window.scrollY;
  bgShapes.forEach((s, i)=>{
    const speed = 0.05 + (i % 3) * 0.04;
    s.style.transform = `translateY(${y * speed}px) rotate(${y * 0.02}deg)`;
  });
}
window.addEventListener('scroll', updateParallax, {passive: true});

/* ============================================
   6. AMBIENT HEARTS + SPARKLES
   ============================================ */
const ambient = document.getElementById('ambient');
const heartChars = ['💖','💕','💗','🎀','✨','💝','🌸'];
function spawnHeart(){
  const h = document.createElement('div');
  h.className = 'heart-bg';
  h.textContent = heartChars[Math.floor(Math.random()*heartChars.length)];
  h.style.left = (Math.random()*100) + 'vw';
  h.style.fontSize = (16 + Math.random()*22) + 'px';
  const d = 8 + Math.random()*8;
  h.style.animationDuration = d + 's';
  ambient.appendChild(h);
  setTimeout(()=>h.remove(), d*1000 + 200);
}
function spawnSparkleBg(){
  const s = document.createElement('div');
  s.className = 'sparkle-bg';
  s.style.left = (Math.random()*100) + 'vw';
  s.style.top = (Math.random()*100) + 'vh';
  s.style.animationDelay = Math.random()*2 + 's';
  ambient.appendChild(s);
  setTimeout(()=>s.remove(), 3200);
}
for(let i=0;i<5;i++) setTimeout(spawnHeart, i*400);
for(let i=0;i<20;i++) spawnSparkleBg();
setInterval(spawnHeart, 1200);
setInterval(spawnSparkleBg, 600);

/* ============================================
   7. TAP SPARKLES
   ============================================ */
const sparkleColors = ['#FFD700','#FF1493','#FF69B4','#fff','#FFB6D9'];
function tapSparkle(x, y){
  for(let i=0;i<6;i++){
    const s = document.createElement('div');
    s.className = 'tap-sparkle';
    const angle = (Math.PI*2/6)*i + Math.random()*0.5;
    const dist = 20 + Math.random()*30;
    const tx = x + Math.cos(angle)*dist;
    const ty = y + Math.sin(angle)*dist;
    s.style.left = tx + 'px';
    s.style.top = ty + 'px';
    const c = sparkleColors[Math.floor(Math.random()*sparkleColors.length)];
    s.style.background = c;
    s.style.borderRadius = '50%';
    s.style.boxShadow = '0 0 8px ' + c;
    document.body.appendChild(s);
    setTimeout(()=>s.remove(), 600);
  }
}
document.addEventListener('click', e=>{
  if(e.target.closest('.candle-group')) return;
  tapSparkle(e.clientX, e.clientY);
});

/* ============================================
   8. CONFETTI
   ============================================ */
const confColors = ['#FF1493','#FFD700','#FF69B4','#fff','#FFB6D9','#E0218A'];
function confettiBurst(count){
  count = count || 60;
  for(let i=0;i<count;i++){
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random()*100 + 'vw';
    c.style.background = confColors[Math.floor(Math.random()*confColors.length)];
    c.style.animationDuration = (2.5 + Math.random()*2) + 's';
    c.style.animationDelay = Math.random()*0.5 + 's';
    if(Math.random()>0.5) c.style.borderRadius = '50%';
    if(Math.random()>0.7){
      c.style.width='14px';c.style.height='14px';
      c.style.background='transparent';
      c.style.color=confColors[Math.floor(Math.random()*confColors.length)];
      c.textContent='♡';c.style.fontSize='16px';c.style.lineHeight='14px';
    }
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 5000);
  }
}
window.addEventListener('load', ()=>{
  setTimeout(()=>confettiBurst(80), 600);
});
document.getElementById('celebrate').addEventListener('click', e=>{
  e.stopPropagation();
  confettiBurst(100);
  tapSparkle(e.clientX, e.clientY);
  playSound('sparkle');
  addLove(2);
});

/* ============================================
   9. CAKE CANDLES
   ============================================ */
let blown = 0;
const total = document.querySelectorAll('.candle-group').length;
const counter = document.getElementById('counter');
const wishMsg = document.getElementById('wishMsg');
const stage = document.getElementById('cakeStage');
document.querySelectorAll('.candle-group').forEach(c=>{
  c.addEventListener('click', e=>{
    e.stopPropagation();
    if(c.classList.contains('out')) return;
    c.classList.add('out');
    blown++;
    counter.textContent = blown + ' / ' + total + ' candles blown';
    playSound('whoosh');
    addLove(3);
    const rect = c.getBoundingClientRect();
    const sRect = stage.getBoundingClientRect();
    for(let i=0;i<3;i++){
      const sm = document.createElement('div');
      sm.className = 'smoke';
      sm.style.left = (rect.left - sRect.left + rect.width/2 + (Math.random()*10-5)) + 'px';
      sm.style.top = (rect.top - sRect.top + 10) + 'px';
      sm.style.animationDelay = (i*0.1) + 's';
      stage.appendChild(sm);
      setTimeout(()=>sm.remove(), 1700);
    }
    if(blown === total){
      counter.textContent = '✨ all candles blown — make your wish ✨';
      setTimeout(()=>{
        wishMsg.classList.add('show');
        confettiBurst(120);
        playSound('sparkle');
        addLove(10);
      }, 500);
    }
  });
});

/* ============================================
   10. GALLERY DOTS + 3D TILT
   ============================================ */
const gallery = document.getElementById('gallery');
const cards = gallery.querySelectorAll('.photo-card');
const dotsWrap = document.getElementById('dots');
cards.forEach((_,i)=>{
  const d = document.createElement('div');
  d.className = 'dot' + (i===0?' active':'');
  dotsWrap.appendChild(d);
});
const dots = dotsWrap.querySelectorAll('.dot');
gallery.addEventListener('scroll', ()=>{
  const sw = gallery.scrollLeft;
  const cw = cards[0].offsetWidth + 18;
  const idx = Math.round(sw / cw);
  dots.forEach((d,i)=>d.classList.toggle('active', i===idx));
});

// 3D tilt on hover/touch
cards.forEach((card, idx)=>{
  const baseRot = (idx % 2 === 0) ? -1.5 : 1.5;
  function onMove(x, y){
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const dx = (x - cx) / r.width;
    const dy = (y - cy) / r.height;
    const tiltX = dy * -10;
    const tiltY = dx * 12;
    card.classList.add('tilting');
    card.style.transform = `rotate(${baseRot}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
  }
  function reset(){
    card.classList.remove('tilting');
    card.style.transform = '';
  }
  card.addEventListener('mousemove', e=>onMove(e.clientX, e.clientY));
  card.addEventListener('mouseleave', reset);
  card.addEventListener('touchmove', e=>{
    if(e.touches[0]){
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, {passive:true});
  card.addEventListener('touchend', reset);
});

/* ============================================
   11. PHOTO LIGHTBOX
   ============================================ */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
let cardTouchStart = 0;
cards.forEach(card=>{
  card.addEventListener('touchstart', ()=>{cardTouchStart = Date.now()}, {passive: true});
  card.addEventListener('click', e=>{
    e.stopPropagation();
    // only treat as tap if quick & no scroll
    const img = card.querySelector('img');
    const tag = card.querySelector('.tag');
    lbImg.src = img.src;
    lbCaption.textContent = tag ? tag.textContent : '';
    lightbox.classList.add('show');
    playSound('tap');
    addLove(1);
  });
});
function closeLightbox(){ lightbox.classList.remove('show'); }
lbClose.addEventListener('click', e=>{ e.stopPropagation(); closeLightbox(); });
lightbox.addEventListener('click', e=>{
  if(e.target === lightbox) closeLightbox();
});

/* ============================================
   12. REASONS FLIP
   ============================================ */
document.querySelectorAll('.reason').forEach(r=>{
  r.addEventListener('click', e=>{
    e.stopPropagation();
    r.classList.toggle('flipped');
    playSound('tap');
    if(r.classList.contains('flipped')){
      const rect = r.getBoundingClientRect();
      tapSparkle(rect.left + rect.width/2, rect.top + rect.height/2);
      addLove(2);
    }
  });
});

/* ============================================
   13. BALLOONS POP GAME
   ============================================ */
const balloonStage = document.getElementById('balloonStage');
const balloonScore = document.getElementById('balloonScore');
const balloonMsgs = [
  'you make me so happy 💕',
  "akku, you're my favorite ✨",
  'beautiful inside and out 🌸',
  'i love your laugh 🎀',
  'happy birthday baby! 🎂',
  'mine forever 💗',
  'akku = sunshine ☀️',
  'cutest girl ever 💖'
];
const balloonColors = [
  ['#FF1493','#E0218A'],
  ['#FFD700','#F5C518'],
  ['#FF69B4','#FF1493'],
  ['#A8186B','#E0218A'],
  ['#FFB6D9','#FF69B4'],
];
let poppedCount = 0;
function makeBalloon(){
  if(!balloonStage.offsetParent) return;
  const stageW = balloonStage.offsetWidth;
  const b = document.createElement('div');
  b.className = 'balloon';
  const colors = balloonColors[Math.floor(Math.random()*balloonColors.length)];
  const uid = Date.now() + '' + Math.random();
  b.innerHTML = `
    <svg viewBox="0 0 54 70" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="27" cy="28" rx="22" ry="26" fill="${colors[0]}"/>
      <ellipse cx="20" cy="20" rx="6" ry="9" fill="#fff" opacity=".4"/>
      <path d="M 24 54 L 30 54 L 27 60 Z" fill="${colors[1]}"/>
      <path d="M 27 60 Q 30 64 26 68 Q 30 70 27 70" stroke="#666" stroke-width="1" fill="none"/>
    </svg>`;
  b.style.left = (10 + Math.random()*(stageW - 70)) + 'px';
  const dur = 7 + Math.random()*3;
  b.style.animationDuration = dur + 's';
  b.addEventListener('click', e=>{
    e.stopPropagation();
    if(b.classList.contains('popped')) return;
    b.classList.add('popped');
    poppedCount++;
    balloonScore.textContent = poppedCount + ' popped — keep going, akku!';
    playSound('pop');
    addLove(2);
    const rect = b.getBoundingClientRect();
    const sRect = balloonStage.getBoundingClientRect();
    const m = document.createElement('div');
    m.className = 'pop-msg';
    m.textContent = balloonMsgs[poppedCount % balloonMsgs.length];
    m.style.left = (rect.left - sRect.left + rect.width/2) + 'px';
    m.style.top = (rect.top - sRect.top) + 'px';
    balloonStage.appendChild(m);
    tapSparkle(rect.left + rect.width/2, rect.top + rect.height/2);
    setTimeout(()=>m.remove(), 2600);
    setTimeout(()=>b.remove(), 500);
    if(poppedCount >= 8){
      balloonScore.innerHTML = '🎉 all popped! you found every message — i love you, akku 💕';
    }
  });
  balloonStage.appendChild(b);
  setTimeout(()=>{ if(b.parentNode) b.remove(); }, dur*1000 + 200);
}
const balloonIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      for(let i=0;i<3;i++) setTimeout(makeBalloon, i*600);
      if(!balloonStage.dataset.started){
        balloonStage.dataset.started = '1';
        setInterval(makeBalloon, 1800);
      }
    }
  });
}, {threshold: 0.3});
balloonIO.observe(document.querySelector('.balloons-section'));

/* ============================================
   14. GIFT BOX
   ============================================ */
const giftBox = document.getElementById('giftBox');
const giftHint = document.getElementById('giftHint');
const giftReveal = document.getElementById('giftReveal');
let giftShakeTimer;
function startGiftShake(){
  giftShakeTimer = setInterval(()=>{
    if(!giftBox.classList.contains('opened')){
      giftBox.classList.add('shaking');
      setTimeout(()=>giftBox.classList.remove('shaking'), 600);
    }
  }, 3500);
}
const giftIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !giftShakeTimer) startGiftShake();
  });
}, {threshold: 0.4});
giftIO.observe(giftBox);

giftBox.addEventListener('click', e=>{
  e.stopPropagation();
  if(giftBox.classList.contains('opened')) return;
  giftBox.classList.remove('shaking');
  giftBox.classList.add('opened');
  clearInterval(giftShakeTimer);
  giftHint.style.display = 'none';
  playSound('sparkle');
  addLove(8);
  setTimeout(()=>{
    giftReveal.classList.add('show');
    confettiBurst(60);
  }, 500);
  const rect = giftBox.getBoundingClientRect();
  for(let i=0;i<3;i++){
    setTimeout(()=>tapSparkle(rect.left + rect.width/2, rect.top + rect.height/3), i*150);
  }
});

/* ============================================
   15. HAPPY BIRTHDAY MELODY
   ============================================ */
const melodyBtn = document.getElementById('melodyBtn');
let isPlaying = false;
const HB = [
  [392, 0.75], [392, 0.25], [440, 1], [392, 1], [523, 1], [494, 2],
  [392, 0.75], [392, 0.25], [440, 1], [392, 1], [587, 1], [523, 2],
  [392, 0.75], [392, 0.25], [784, 1], [659, 1], [523, 1], [494, 1], [440, 2],
  [698, 0.75], [698, 0.25], [659, 1], [523, 1], [587, 1], [523, 2],
];
function playNote(ctx, freq, startTime, duration){
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
  gain.gain.setValueAtTime(0.25, startTime + duration - 0.08);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq*2, startTime);
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, startTime);
  gain2.gain.linearRampToValueAtTime(0.08, startTime + 0.03);
  gain2.gain.setValueAtTime(0.08, startTime + duration - 0.08);
  gain2.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc2.connect(gain2).connect(ctx.destination);
  osc.start(startTime); osc.stop(startTime + duration);
  osc2.start(startTime); osc2.stop(startTime + duration);
}
function floatNote(){
  const note = document.createElement('div');
  note.className = 'music-note';
  note.textContent = ['🎵','🎶','♪','♫'][Math.floor(Math.random()*4)];
  const rect = melodyBtn.getBoundingClientRect();
  note.style.left = (rect.left + rect.width/2 + (Math.random()*60-30)) + 'px';
  note.style.top = (rect.top) + 'px';
  document.body.appendChild(note);
  setTimeout(()=>note.remove(), 2100);
}
melodyBtn.addEventListener('click', e=>{
  e.stopPropagation();
  if(isPlaying) return;
  const ctx = getAudio();
  isPlaying = true;
  melodyBtn.classList.add('playing');
  melodyBtn.querySelector('span:last-child').textContent = 'Playing... 🎂';
  addLove(5);
  const tempo = 0.42;
  let t = ctx.currentTime + 0.1;
  HB.forEach(([f, d])=>{
    playNote(ctx, f, t, d * tempo);
    t += d * tempo;
  });
  const totalMs = (t - ctx.currentTime) * 1000;
  const noteInterval = setInterval(floatNote, 300);
  setTimeout(()=>{
    confettiBurst(40);
    clearInterval(noteInterval);
    isPlaying = false;
    melodyBtn.classList.remove('playing');
    melodyBtn.querySelector('span:last-child').textContent = 'Play again 💕';
  }, totalMs);
});

/* ============================================
   16. WISHES JAR
   ============================================ */
const jarSvg = document.getElementById('jarSvg');
const wishCard = document.getElementById('wishCard');
const wishText = document.getElementById('wishText');
const wishNum = document.getElementById('wishNum');
const wishAgainBtn = document.getElementById('wishAgainBtn');
const wishes = [
  "May you wake up every day knowing how deeply you're loved, akku ✨",
  "I wish you the kind of happiness that crinkles your eyes when you smile 💕",
  "May this year bring you everything you've been quietly hoping for 🎀",
  "I wish you a love that grows softer and stronger every day — i'm right here for it 💗",
  "May the universe spoil you the way you deserve, baby 🌸",
  "I wish you long, peaceful nights and bright, hopeful mornings ☀️",
  "May every dream of yours come true — i'll cheer for each one 💖",
  "I wish you the cutest, dumbest, happiest little moments all year long 🎂",
  "May you always feel safe in my arms and special in my heart 🫶",
  "I wish for you a year where everything you touch turns to pink 💝",
  "May you laugh until your stomach hurts, way too often, akku 😂",
  "I wish you a year of being absolutely, unapologetically YOU 🎀",
  "May our story keep getting better with every single page 📖",
  "I wish you forehead kisses, surprise flowers, and a hand that never lets go of yours 💋",
  "May you always know — you are my favorite person in the world 💕"
];
let drawnWishes = new Set();
let wishCounter = 0;
function drawWish(){
  jarSvg.classList.add('shaking');
  setTimeout(()=>jarSvg.classList.remove('shaking'), 600);
  // Flying note
  const note = document.createElement('div');
  note.className = 'flying-note';
  const rect = jarSvg.getBoundingClientRect();
  note.style.left = (rect.left + rect.width/2) + 'px';
  note.style.top = (rect.top + rect.height/3) + 'px';
  document.body.appendChild(note);
  playSound('sparkle');
  // pick a wish we haven't shown recently
  if(drawnWishes.size >= wishes.length) drawnWishes.clear();
  let i;
  do { i = Math.floor(Math.random()*wishes.length); } while(drawnWishes.has(i));
  drawnWishes.add(i);
  wishCounter++;
  setTimeout(()=>{
    note.remove();
    wishText.textContent = wishes[i];
    wishNum.textContent = wishCounter;
    wishCard.classList.add('show');
    addLove(3);
  }, 700);
}
jarSvg.addEventListener('click', e=>{
  e.stopPropagation();
  drawWish();
});
wishAgainBtn.addEventListener('click', e=>{
  e.stopPropagation();
  wishCard.classList.remove('show');
  setTimeout(drawWish, 300);
});

/* ============================================
   17. KISS BUTTON
   ============================================ */
const kissBtn = document.getElementById('kissBtn');
kissBtn.addEventListener('click', e=>{
  e.stopPropagation();
  const k = document.createElement('div');
  k.className = 'flying-kiss';
  k.textContent = '💋';
  const rect = kissBtn.getBoundingClientRect();
  k.style.left = (rect.left + rect.width/2) + 'px';
  k.style.top = (rect.top + rect.height/2) + 'px';
  document.body.appendChild(k);
  playSound('kiss');
  addLove(5);
  // trail of small hearts
  for(let i=0;i<6;i++){
    setTimeout(()=>{
      const h = document.createElement('div');
      h.className = 'drag-heart';
      h.textContent = ['💕','💖','💗'][Math.floor(Math.random()*3)];
      h.style.left = (rect.left + rect.width/2 + (Math.random()*40-20)) + 'px';
      h.style.top = (rect.top - i*30) + 'px';
      h.style.fontSize = '24px';
      document.body.appendChild(h);
      setTimeout(()=>h.remove(), 1000);
    }, i*100);
  }
  setTimeout(()=>k.remove(), 2200);
});

/* ============================================
   18. HEART DRAG TRAIL
   ============================================ */
const dragHearts = ['💗','💕','🎀','✨','💖','🌸'];
let lastTrail = 0;
function dropHeart(x, y){
  const now = Date.now();
  if(now - lastTrail < 60) return;
  lastTrail = now;
  const h = document.createElement('div');
  h.className = 'drag-heart';
  h.textContent = dragHearts[Math.floor(Math.random()*dragHearts.length)];
  h.style.left = x + 'px';
  h.style.top = y + 'px';
  document.body.appendChild(h);
  setTimeout(()=>h.remove(), 1000);
}
document.addEventListener('touchmove', e=>{
  if(e.touches[0]) dropHeart(e.touches[0].clientX, e.touches[0].clientY);
}, {passive: true});
let mouseDown = false;
document.addEventListener('mousedown', ()=>mouseDown = true);
document.addEventListener('mouseup', ()=>mouseDown = false);
document.addEventListener('mousemove', e=>{
  if(mouseDown) dropHeart(e.clientX, e.clientY);
});

/* ============================================
   19. EASTER EGG on name
   ============================================ */
const heroName = document.getElementById('heroName');
const easterBanner = document.getElementById('easterBanner');
let nameTaps = 0;
let nameTapTimer = null;
function showEasterBanner(htmlContent){
  if(htmlContent) easterBanner.innerHTML = htmlContent;
  easterBanner.classList.add('show');
  setTimeout(()=>easterBanner.classList.remove('show'), 4000);
}
heroName.style.cursor = 'pointer';
heroName.addEventListener('click', e=>{
  e.stopPropagation();
  nameTaps++;
  heroName.style.transition = 'transform .2s';
  heroName.style.transform = `scale(${1 + nameTaps*0.04}) rotate(${(nameTaps%2?1:-1)*2}deg)`;
  setTimeout(()=>{ heroName.style.transform = ''; }, 200);
  clearTimeout(nameTapTimer);
  nameTapTimer = setTimeout(()=>{ nameTaps = 0; }, 3000);
  if(nameTaps === 5){
    nameTaps = 0;
    showEasterBanner('🎉 you found a secret, akku! 🎉<br><span style="font-size:1rem;font-family:Quicksand;font-weight:600">i hid it just for you 💗</span>');
    confettiBurst(150);
    for(let i=0;i<25;i++) setTimeout(spawnHeart, i*40);
    addLove(15);
    playSound('sparkle');
  }
});

/* ============================================
   20. SCROLL REVEAL
   ============================================ */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, {threshold: 0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ============================================
   21. Prevent double-tap zoom on iOS
   ============================================ */
let lastTouch = 0;
document.addEventListener('touchend', e=>{
  const now = Date.now();
  if(now - lastTouch <= 300){
    if(!e.target.closest('input,textarea,select')) e.preventDefault();
  }
  lastTouch = now;
}, {passive: false});
