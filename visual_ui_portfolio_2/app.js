/* ==========================================================================
   PROJECT 02 &bull; OLIV.AI BRAND & MARKETING UX
   Designer: Sohaib Ahmer
   ========================================================================== */

let isAnnualBilling = true;

const FEATURE_PANES_DATA = [
  {
    title: "01. Autonomous Meeting Call Intelligence",
    subtitle: "Parses calls & emails in real-time, populating MEDDICC metrics without rep entry.",
    desc: "Autonomous AI Agents join your Gong, Zoom, or Google Meet calls, extract exact metrics ($M$, $E$, $D$, $I$, $C$), and link transcript quotes directly to CRM fields.",
    metric: "4.5 Hours Saved / Rep / Week",
    metricLabel: "Eliminates manual Gong & Salesforce data entry",
    highlights: ["Real-time audio stream parsing", "Direct transcript quote citations", "SOC-2 Type II audit compliance"]
  },
  {
    title: "02. Zero-Friction CRM Sync & Data Trust",
    subtitle: "Bi-directional instant sync with Salesforce, HubSpot, and Gong.",
    desc: "Never let outdated CRM notes stall revenue pipeline again. Oliv AI automatically updates deal stages, close dates, and risk flags with 100% data trust.",
    metric: "100% Unbiased CRM Accuracy",
    metricLabel: "Zero manual rep typing required",
    highlights: ["Bi-directional Salesforce & HubSpot sync", "Automated pipeline stage updates", "Audit-ready deal history"]
  },
  {
    title: "03. AI Revenue Risk Radar & Forecasting",
    subtitle: "Proactive risk detection when Economic Buyers ($E$) are absent.",
    desc: "Gain instant executive visibility into deal health. Oliv AI flags missing buyers, unqualified Champions, and stalled procurement timelines before QBRs.",
    metric: "+38% Pipeline Velocity",
    metricLabel: "Proactive risk detection & forecast accuracy",
    highlights: ["Economic Buyer absence alerts", "Automated MEDDICC health scorecards", "Executive RevOps radar dashboard"]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Fluid jelly cursor disabled as requested
  initSpotlightEngine();
  setupWaveformAnimation();
  setupThemeEngine();
  setupHeaderNavObserver();
  switchFeatureTab(0);
  updateRoiCalculator(20);
});

/* 1. HEADER NAV SCROLL & ACTIVE SECTION HIGHLIGHT OBSERVER (FLICKER-FREE) */
function setupHeaderNavObserver() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  let isManualScrolling = false;
  let scrollTimeout = null;

  // Click handler with smooth scroll accounting for sticky header offset
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        isManualScrolling = true;

        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const headerOffset = 90;
        const elementPosition = targetSec.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isManualScrolling = false;
        }, 800);
      }
    });
  });

  // Scroll Intersection Observer (bypassed while smooth scrolling to eliminate flicker)
  const observer = new IntersectionObserver((entries) => {
    if (isManualScrolling) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));
}

/* 2. DYNAMIC FLUID CANVAS 2D PARTICLE PHYSICS ENGINE */
function initJellyCursorEngine() {
  const canvas = document.getElementById('dynamic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  let mouse = { x: width / 2, y: height / 2 };
  let jelly = { x: width / 2, y: height / 2, vx: 0, vy: 0, radius: 42 };
  let trailSparks = [];
  let time = 0;
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (orb1) orb1.style.transform = `translate(${(e.clientX - width / 2) * 0.04}px, ${(e.clientY - height / 2) * 0.04}px)`;
    if (orb2) orb2.style.transform = `translate(${(e.clientX - width / 2) * -0.03}px, ${(e.clientY - height / 2) * -0.03}px)`;

    if (Math.random() < 0.45) {
      trailSparks.push({
        x: e.clientX + (Math.random() - 0.5) * 16,
        y: e.clientY + (Math.random() - 0.5) * 16,
        radius: Math.random() * 3 + 1,
        alpha: 0.7,
        life: 0
      });
    }
  });
  
  function renderJelly() {
    ctx.clearRect(0, 0, width, height);
    time += 0.035;
    
    const dx = mouse.x - jelly.x;
    const dy = mouse.y - jelly.y;
    
    jelly.vx += dx * 0.07;
    jelly.vy += dy * 0.07;
    jelly.vx *= 0.75;
    jelly.vy *= 0.75;
    
    jelly.x += jelly.vx;
    jelly.y += jelly.vy;
    
    const speed = Math.sqrt(jelly.vx * jelly.vx + jelly.vy * jelly.vy);
    const angle = Math.atan2(jelly.vy, jelly.vx);
    const stretch = Math.min(speed * 0.018, 0.38);
    
    ctx.save();
    ctx.translate(jelly.x, jelly.y);
    ctx.rotate(angle);
    ctx.scale(1 + stretch, 1 - stretch * 0.5);
    
    ctx.beginPath();
    const points = 22;
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2;
      const wobble = Math.sin(time * 3 + a * 4) * 4;
      const r = jelly.radius + wobble;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, jelly.radius * 1.5);
    grad.addColorStop(0, 'rgba(94, 92, 230, 0.35)');
    grad.addColorStop(0.5, 'rgba(10, 132, 255, 0.2)');
    grad.addColorStop(1, 'rgba(94, 92, 230, 0)');
    
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(94, 92, 230, 0.5)';
    ctx.shadowBlur = 32;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
    
    ctx.restore();

    for (let i = trailSparks.length - 1; i >= 0; i--) {
      const sp = trailSparks[i];
      sp.alpha -= 0.025;
      sp.life += 1;
      
      if (sp.alpha <= 0 || sp.life > 25) {
        trailSparks.splice(i, 1);
        continue;
      }
      
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 132, 255, ${sp.alpha})`;
      ctx.shadowColor = 'rgba(10, 132, 255, 0.6)';
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    requestAnimationFrame(renderJelly);
  }
  
  renderJelly();
}

/* 3. REAL-TIME RADIAL SPOTLIGHT ENGINE (FLAT 2D CARDS) */
function initSpotlightEngine() {
  const cards = document.querySelectorAll('.glass-spotlight-card, .footer-glass-card, .hero-waveform-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* 4. INTERACTIVE AUDIO WAVEFORM BARS ANIMATOR */
function setupWaveformAnimation() {
  const container = document.getElementById('waveform-bars');
  if (!container) return;
  
  const barCount = 36;
  container.innerHTML = '';
  
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    if (i >= 8 && i <= 24) bar.classList.add('active');
    container.appendChild(bar);
  }
  
  const bars = container.querySelectorAll('.wave-bar');
  setInterval(() => {
    bars.forEach(bar => {
      const h = Math.floor(Math.random() * 75) + 15;
      bar.style.height = `${h}%`;
    });
  }, 180);
}

/* 5. FEATURE SHOWCASE TAB SWITCHER */
window.switchFeatureTab = function(idx) {
  const btns = document.querySelectorAll('.feature-tab-btn');
  btns.forEach((b, i) => {
    if (i === idx) b.classList.add('active');
    else b.classList.remove('active');
  });
  
  const data = FEATURE_PANES_DATA[idx];
  const container = document.getElementById('feature-display-card');
  if (!container || !data) return;
  
  const highlightsList = data.highlights.map(h => `<li style="margin-bottom:8px; display:flex; align-items:center; gap:8px;"><span style="color:var(--semantic-emerald)">✓</span> <span>${h}</span></li>`).join('');
  
  container.innerHTML = `
    <div class="feature-pane-content">
      <div>
        <span style="font-family:var(--font-mono); font-size:11px; color:var(--accent-brand); text-transform:uppercase; font-weight:700; display:block; margin-bottom:8px;">CAPABILITY SPECIFICATION</span>
        <h3 style="font-family:var(--font-heading); font-size:24px; font-weight:800; color:var(--text-primary); margin-bottom:10px;">${data.title}</h3>
        <p style="font-size:14px; color:var(--text-secondary); line-height:1.6; margin-bottom:20px;">${data.desc}</p>
        
        <ul style="list-style:none; font-size:13px; color:var(--text-secondary); margin-bottom:24px;">
          ${highlightsList}
        </ul>
      </div>

      <div class="subcard-pane" style="text-align:center; padding:32px 24px;">
        <span style="font-family:var(--font-mono); font-size:10.5px; color:var(--accent-cyan); text-transform:uppercase;">MEASURED ROI BENCHMARK</span>
        <div style="font-family:var(--font-mono); font-size:32px; font-weight:800; color:var(--semantic-emerald); margin:12px 0 4px;">${data.metric}</div>
        <div style="font-size:12px; color:var(--text-tertiary); margin-bottom:20px;">${data.metricLabel}</div>
        
        <a href="mailto:sohaib@duck.com" class="btn-minimal-primary" style="width:100%; text-decoration:none;">
          <span>Request Feature Access</span>
        </a>
      </div>
    </div>
  `;
};

/* 6. DYNAMIC REP ROI CALCULATOR ENGINE */
window.updateRoiCalculator = function(repCount) {
  const numReps = parseInt(repCount, 10);
  const elCount = document.getElementById('roi-rep-count');
  const elHours = document.getElementById('roi-hours-saved');
  const elUplift = document.getElementById('roi-pipeline-uplift');
  
  if (elCount) elCount.textContent = `${numReps} AEs`;
  
  const annualHours = numReps * 4.5 * 52;
  const formattedHours = new Intl.NumberFormat('en-US').format(annualHours);
  if (elHours) elHours.textContent = `${formattedHours} Hours`;
  
  const pipelineUplift = numReps * 21000;
  const formattedUplift = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pipelineUplift);
  if (elUplift) elUplift.textContent = `+${formattedUplift}`;
};

/* 7. INTERACTIVE PRICING CARD SELECTION ENGINE */
window.selectPricingCard = function(selectedCard) {
  const container = document.getElementById('pricing-cards-container');
  if (!container) return;
  
  const cards = container.querySelectorAll('.pricing-card');
  cards.forEach(c => {
    c.classList.remove('featured');
    c.style.borderColor = 'var(--border-subtle)';
    c.style.background = 'var(--bg-card)';
  });
  
  selectedCard.classList.add('featured');
  selectedCard.style.borderColor = 'var(--accent-brand)';
  selectedCard.style.background = 'var(--bg-surface)';
};

/* 8. SEGMENTED BILLING PERIOD SWITCHER ENGINE */
window.setBillingPeriod = function(isAnnual) {
  isAnnualBilling = isAnnual;
  const bar = document.getElementById('billing-segmented-bar');
  if (bar) {
    const btns = bar.querySelectorAll('button');
    if (btns.length >= 2) {
      if (isAnnual) {
        btns[0].classList.remove('active');
        btns[1].classList.add('active');
      } else {
        btns[1].classList.remove('active');
        btns[0].classList.add('active');
      }
    }
  }
  
  const starter = document.getElementById('price-starter');
  const scale = document.getElementById('price-scale');
  
  if (isAnnualBilling) {
    if (starter) starter.innerHTML = "$49<span style='font-size:14px; font-weight:400; color:var(--text-tertiary);'>/rep/mo</span>";
    if (scale) scale.innerHTML = "$99<span style='font-size:14px; font-weight:400; color:var(--text-tertiary);'>/rep/mo</span>";
  } else {
    if (starter) starter.innerHTML = "$59<span style='font-size:14px; font-weight:400; color:var(--text-tertiary);'>/rep/mo</span>";
    if (scale) scale.innerHTML = "$119<span style='font-size:14px; font-weight:400; color:var(--text-tertiary);'>/rep/mo</span>";
  }
};

/* 9. SINGLE CLEAN DARK / LIGHT MODE TOGGLE ENGINE */
function setupThemeEngine() {
  const btn = document.getElementById('btn-toggle-theme');
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  
  if (btn) {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        if (icon) icon.textContent = '☀️';
        if (label) label.textContent = 'Light Mode';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (icon) icon.textContent = '🌙';
        if (label) label.textContent = 'Dark Mode';
      }
    });
  }
}
