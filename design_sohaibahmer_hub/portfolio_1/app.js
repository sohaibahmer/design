/* ==========================================================================
   OLIV.AI PORTFOLIO #1 - 100% MOTION & SPOTLIGHT CONSISTENCY ENGINE
   Designer: Sohaib Ahmer (NID Postgraduate Alumnus)
   Features: Fixed Copy Tokens Button Initializer & Cleaned Text Copy
   ========================================================================== */

let DEALS_DATABASE = [
  {
    id: "DEAL-9081",
    company: "Acme Corp",
    title: "Enterprise Revenue AI Suite",
    value: 480000,
    owner: "Sarah Jenkins",
    stage: "Proposal",
    dotClass: "dot-proposal",
    meddicc: { metrics: 95, economicBuyer: 90, decisionCriteria: 98, decisionProcess: 92, identifyPain: 95, champion: 96, competition: 90 },
    citations: {
      metrics: "CFO confirmed $500k budget is pre-approved for automated CRM deal scoring.",
      economicBuyer: "Direct 1-on-1 meeting logged with CFO on Aug 12.",
      decisionCriteria: "Security architecture pack passed SOC-2 Type II audit.",
      decisionProcess: "Legal review in final stage. Go-live target: Aug 15.",
      identifyPain: "Current Gong plugin requires 4.5 hrs/week manual rep entry.",
      champion: "VP Sales Operations is driving daily internal deployment syncs.",
      competition: "Gong script evaluated & dropped due to lack of automated AI agent scoring."
    },
    transcript: "CFO confirmed $500k budget is pre-approved for automated CRM deal scoring. Champion pushing for Aug 15 go-live.",
    lastActivity: "2h ago"
  },
  {
    id: "DEAL-8432",
    company: "Stripe Systems",
    title: "Global RevOps Intelligence",
    value: 750000,
    owner: "Marcus Vance",
    stage: "Negotiation",
    dotClass: "dot-negotiation",
    meddicc: { metrics: 80, economicBuyer: 35, decisionCriteria: 70, decisionProcess: 55, identifyPain: 85, champion: 45, competition: 75 },
    citations: {
      metrics: "ROI calculator estimates $1.2M annual rep time savings.",
      economicBuyer: "⚠️ AI Alert: VP Engineering attended instead of CFO. Budget authority unconfirmed.",
      decisionCriteria: "Requires multi-region EMEA data residency compliance.",
      decisionProcess: "Procurement stalled pending multi-year contract discount.",
      identifyPain: "High rep turnover caused by manual Salesforce entry friction.",
      champion: "Champion lacks executive sign-off authority for >$500k deals.",
      competition: "Evaluating legacy Gong plugin against Oliv AI autonomous agents."
    },
    transcript: "VP Engineering attended instead of CFO. AI transcript detected reluctance regarding multi-year commitment without ROI guarantee.",
    lastActivity: "1d ago"
  },
  {
    id: "DEAL-7104",
    company: "Datadog Cloud",
    title: "MEDDICC Auto-Scorecard Rollout",
    value: 220000,
    owner: "Elena Rostova",
    stage: "Discovery",
    dotClass: "dot-discovery",
    meddicc: { metrics: 90, economicBuyer: 85, decisionCriteria: 90, decisionProcess: 85, identifyPain: 95, champion: 90, competition: 80 },
    citations: {
      metrics: "Targeting 25% increase in AE qualified pipeline conversion.",
      economicBuyer: "RevOps lead stated: 'If Oliv can capture call data without reps typing, we will replace legacy Gong scorecard plugins immediately.'",
      decisionCriteria: "Native Salesforce & HubSpot bi-directional sync required.",
      decisionProcess: "2-week proof of concept sandbox deployed.",
      identifyPain: "Sales reps logging inaccurate MEDDICC scores prior to QBRs.",
      champion: "Director of Sales Strategy actively testing Oliv AI Agent beta.",
      competition: "Direct replacement of manual spreadsheet scoring."
    },
    transcript: "RevOps lead stated: 'If Oliv can capture call data without reps typing, we will replace legacy Gong scorecard plugins immediately.'",
    lastActivity: "4h ago"
  },
  {
    id: "DEAL-6921",
    company: "Snowflake Inc",
    title: "AI Agent Workforce License",
    value: 1250000,
    owner: "David Chen",
    stage: "Closed Won",
    dotClass: "dot-closed",
    meddicc: { metrics: 100, economicBuyer: 96, decisionCriteria: 100, decisionProcess: 95, identifyPain: 100, champion: 98, competition: 95 },
    citations: {
      metrics: "1,400 AE licenses onboarded across US & EMEA regions.",
      economicBuyer: "Final sign-off executed by Chief Revenue Officer.",
      decisionCriteria: "100% automated call transcription & MEDDICC extraction verified.",
      decisionProcess: "Master Services Agreement signed.",
      identifyPain: "Eliminated 5,000+ hours of manual CRM entry per month.",
      champion: "CRO & Head of Global Enablement serve as public references.",
      competition: "Sole winner of enterprise RevOps AI RFP."
    },
    transcript: "Final sign-off call with CRO. 1,400 sales reps onboarding across US & EMEA regions.",
    lastActivity: "Yesterday"
  },
  {
    id: "DEAL-5510",
    company: "Linear Design",
    title: "Design System & RevOps Sync",
    value: 140000,
    owner: "Sarah Jenkins",
    stage: "Discovery",
    dotClass: "dot-discovery",
    meddicc: { metrics: 50, economicBuyer: 40, decisionCriteria: 60, decisionProcess: 50, identifyPain: 70, champion: 55, competition: 40 },
    citations: {
      metrics: "Evaluating rep time savings against pilot subscription fee.",
      economicBuyer: "Design Director interested; CFO budget approval pending.",
      decisionCriteria: "Requires custom Figma & Linear RevOps webhook integration.",
      decisionProcess: "Initial technical discovery call completed.",
      identifyPain: "Need real-time deal risk visibility for mid-market AE team.",
      champion: "Lead Product Designer championing Oliv UI simplicity.",
      competition: "Comparing against manual Notion scorecard template."
    },
    transcript: "Prospect evaluating Gong script vs Oliv AI automated scorecard. Needs direct competitive ROI comparison.",
    lastActivity: "3d ago"
  }
];

let activeDeal = null;

document.addEventListener('DOMContentLoaded', () => {
  initJellyCursorEngine();
  init3dTiltAndSpotlightEngine();
  initButtonBendAndGlowEngine();
  renderTable(DEALS_DATABASE);
  setupNavTabs();
  setupFilters();
  setupThemeEngine();
  setupNewDealModal();
  setupCopyTokens();
  setupTypeTester();
});

/* 0. EXECUTIVE CASE STUDY STORY ACCORDION TOGGLE */
window.toggleCaseStory = function() {
  const content = document.getElementById('story-content');
  const icon = document.getElementById('story-toggle-icon');
  if (!content) return;
  
  if (content.style.display === 'none') {
    content.style.display = 'grid';
    if (icon) icon.textContent = '[ - Hide Strategy ]';
    init3dTiltAndSpotlightEngine();
  } else {
    content.style.display = 'none';
    if (icon) icon.textContent = '[ + View Strategy & ROI ]';
  }
};

/* 1. DYNAMIC SUBTLE JELLY MOUSE CURSOR PHYSICS ENGINE */
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

/* 2. SPOTLIGHT & 3D TILT ENGINE */
function init3dTiltAndSpotlightEngine() {
  const cards = document.querySelectorAll('.kpi-minimal-card, .hero-minimal, .inspector-center-card, .case-story-card, .footer-glass-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      if (!card.classList.contains('inspector-center-card') && !card.classList.contains('case-story-card') && !card.classList.contains('footer-glass-card')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('inspector-center-card') && !card.classList.contains('case-story-card') && !card.classList.contains('footer-glass-card')) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      }
    });
  });
}

/* 3. BUTTON ENGINE */
function initButtonBendAndGlowEngine() {
  const buttons = document.querySelectorAll('.page-container .btn-minimal-primary, .page-container .btn-minimal-secondary');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const rotateY = (x / (rect.width / 2)) * 8;
      btn.style.transform = `perspective(400px) rotateY(${rotateY}deg)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'perspective(400px) rotateY(0deg)';
    });
  });
}

/* 4. Weighted MEDDICC Math & Risk Signal */
function computeMeddiccScore(m) {
  const s = (m.economicBuyer * 0.25) + (m.champion * 0.20) + (m.identifyPain * 0.15) + (m.metrics * 0.15) + (m.decisionCriteria * 0.10) + (m.decisionProcess * 0.08) + (m.competition * 0.07);
  return Math.round(s);
}

function deriveRiskSignal(deal, score) {
  if (deal.meddicc.economicBuyer < 50) return { flagged: true, text: "Economic Buyer absent from recent meeting transcripts." };
  if (deal.meddicc.champion < 50) return { flagged: true, text: "Champion lacks internal executive authority." };
  if (score >= 85) return { flagged: false, text: "Fully qualified. Legal and security pack dispatched." };
  return { flagged: false, text: "Discovery stage. Validating primary pain points." };
}

/* 5. Render Table */
function renderTable(dataset) {
  const tbody = document.getElementById('table-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (dataset.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:36px; color:var(--text-tertiary);">No deals match your search filter.</td></tr>`;
    return;
  }
  
  dataset.forEach(deal => {
    const score = computeMeddiccScore(deal.meddicc);
    const signal = deriveRiskSignal(deal, score);
    const tr = document.createElement('tr');
    tr.id = `row-${deal.id}`;
    
    const formattedVal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(deal.value);
    
    let scoreColor = 'var(--semantic-emerald)';
    if (score < 70) scoreColor = 'var(--semantic-rose)';
    else if (score < 85) scoreColor = 'var(--semantic-amber)';

    tr.innerHTML = `
      <td>
        <div style="font-family:var(--font-heading); font-weight:600; font-size:13.5px; color:var(--text-primary);">${deal.company}</div>
        <div style="font-size:11.5px; color:var(--text-tertiary);">${deal.title} &bull; <span style="font-family:var(--font-mono);">${deal.id}</span></div>
      </td>
      <td style="font-family:var(--font-mono); font-weight:600; color:var(--text-primary);">${formattedVal}</td>
      <td>
        <div class="status-dot-cell">
          <span class="dot-indicator ${deal.dotClass}"></span>
          <span>${deal.stage}</span>
        </div>
      </td>
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-family:var(--font-mono); font-weight:600; width:36px;" id="cell-score-${deal.id}">${score}%</span>
          <div style="width:70px; height:4px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden;">
            <div id="cell-bar-${deal.id}" style="height:100%; width:${score}%; background:${scoreColor}; border-radius:2px; transition:width 0.2s ease;"></div>
          </div>
        </div>
      </td>
      <td>
        <div id="cell-signal-${deal.id}" style="font-size:12px; color:${signal.flagged ? 'var(--semantic-rose)' : 'var(--text-secondary)'};">
          ${signal.text}
        </div>
      </td>
      <td style="color:var(--text-secondary); font-size:12px;">${deal.owner}</td>
    `;
    
    tr.addEventListener('click', () => openInspectorDrawer(deal));
    tbody.appendChild(tr);
  });
  
  updateKpiSummary();
}

function updateKpiSummary() {
  const totalVal = DEALS_DATABASE.reduce((sum, d) => sum + d.value, 0);
  const formattedVal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalVal);
  const flagged = DEALS_DATABASE.filter(d => computeMeddiccScore(d.meddicc) < 70 || d.meddicc.economicBuyer < 50).length;
  const avgScore = Math.round(DEALS_DATABASE.reduce((sum, d) => sum + computeMeddiccScore(d.meddicc), 0) / DEALS_DATABASE.length);
  
  const elVal = document.getElementById('kpi-pipeline-val');
  const elFlag = document.getElementById('kpi-flagged-val');
  const elAvg = document.getElementById('kpi-avg-val');
  
  if (elVal) elVal.textContent = formattedVal;
  if (elFlag) elFlag.textContent = `${flagged} Flagged`;
  if (elAvg) elAvg.textContent = `${avgScore}%`;
}

/* 6. CIRCULAR SVG RING GAUGE & MASTER SCORE ENGINE */
function updateCircularRingGauge(score) {
  const fillCircle = document.getElementById('gauge-circle-fill');
  const valText = document.getElementById('gauge-val-text');
  const masterSlider = document.getElementById('master-score-slider');
  
  const circumference = 251.327;
  const offset = circumference * (1 - score / 100);
  
  let scoreColor = 'var(--semantic-emerald)';
  if (score < 70) scoreColor = 'var(--semantic-rose)';
  else if (score < 85) scoreColor = 'var(--semantic-amber)';
  
  if (fillCircle) {
    fillCircle.style.strokeDashoffset = offset;
    fillCircle.style.stroke = scoreColor;
  }
  if (valText) {
    valText.textContent = `${score}%`;
    valText.style.color = scoreColor;
    valText.style.textShadow = 'none';
  }
  if (masterSlider) {
    masterSlider.value = score;
    masterSlider.style.background = `linear-gradient(to right, ${scoreColor} 0%, ${scoreColor} ${score}%, var(--bg-canvas) ${score}%)`;
  }
}

function openInspectorDrawer(deal) {
  activeDeal = deal;
  const overlay = document.getElementById('inspector-overlay');
  if (!overlay) return;
  
  const score = computeMeddiccScore(deal.meddicc);
  const signal = deriveRiskSignal(deal, score);
  const formattedVal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(deal.value);
  
  document.getElementById('m-id').textContent = deal.id;
  document.getElementById('m-company').textContent = deal.company;
  document.getElementById('m-title').textContent = deal.title;
  document.getElementById('m-val').textContent = formattedVal;
  document.getElementById('m-score').textContent = `${score}%`;
  document.getElementById('m-transcript').textContent = `"${deal.transcript}"`;
  document.getElementById('m-advice').textContent = signal.text;
  
  updateCircularRingGauge(score);
  renderSliders(deal);
  
  updateAiCitation('economicBuyer');
  
  overlay.classList.add('open');
  init3dTiltAndSpotlightEngine();
}

/* AI SOURCE ATTRIBUTION CITATION CALLOUT UPDATER */
function updateAiCitation(paramKey) {
  if (!activeDeal || !activeDeal.citations) return;
  const citationText = document.getElementById('ai-citation-text');
  const badge = document.getElementById('ai-confidence-badge');
  
  const text = activeDeal.citations[paramKey] || activeDeal.transcript;
  const confidence = activeDeal.meddicc[paramKey] > 80 ? '98.4% Confidence' : '74.2% Confidence';
  
  if (citationText) {
    citationText.innerHTML = `<strong>Quote Citation (${paramKey}):</strong> "${text}"`;
  }
  if (badge) {
    badge.textContent = confidence;
  }
}

function renderSliders(deal) {
  const container = document.getElementById('sliders-container');
  if (!container) return;
  
  const fields = [
    { k: 'metrics', l: 'Metrics (M)' },
    { k: 'economicBuyer', l: 'Economic Buyer (E)' },
    { k: 'decisionCriteria', l: 'Decision Criteria (D1)' },
    { k: 'decisionProcess', l: 'Decision Process (D2)' },
    { k: 'identifyPain', l: 'Identify Pain (I)' },
    { k: 'champion', l: 'Champion (C)' },
    { k: 'competition', l: 'Competition (C2)' }
  ];
  
  container.innerHTML = fields.map(f => {
    const val = deal.meddicc[f.k];
    const fillGrad = `linear-gradient(to right, var(--accent-brand) 0%, var(--accent-brand) ${val}%, var(--bg-canvas) ${val}%)`;
    
    return `
      <div style="margin-bottom:8px;" onmouseenter="updateAiCitation('${f.k}')">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; margin-bottom:2px;">
          <span style="color:var(--text-secondary);">${f.l}</span>
          <span style="font-family:var(--font-mono); font-weight:600; width:38px; text-align:right; font-variant-numeric:tabular-nums; display:inline-block; transition:transform 0.15s ease;" id="sval-${f.k}">${val}%</span>
        </div>
        <input type="range" class="custom-range-slider" id="slider-${f.k}" style="background:${fillGrad};" min="0" max="100" value="${val}" oninput="onScoreSlide('${f.k}', this.value)" onfocus="updateAiCitation('${f.k}')">
      </div>
    `;
  }).join('');
}

window.onMasterScoreSlide = function(val) {
  if (!activeDeal) return;
  const numVal = parseInt(val, 10);
  
  Object.keys(activeDeal.meddicc).forEach(k => {
    activeDeal.meddicc[k] = numVal;
  });
  
  renderSliders(activeDeal);
  onScoreSlide('economicBuyer', numVal);
};

window.onScoreSlide = function(key, val) {
  if (!activeDeal) return;
  const numVal = parseInt(val, 10);
  activeDeal.meddicc[key] = numVal;
  
  updateAiCitation(key);
  
  const sliderEl = document.getElementById(`slider-${key}`);
  if (sliderEl) {
    sliderEl.style.background = `linear-gradient(to right, var(--accent-brand) 0%, var(--accent-brand) ${numVal}%, var(--bg-canvas) ${numVal}%)`;
  }
  
  const numSpan = document.getElementById(`sval-${key}`);
  if (numSpan) {
    numSpan.textContent = `${numVal}%`;
    numSpan.classList.remove('pulse-update');
    void numSpan.offsetWidth;
    numSpan.classList.add('pulse-update');
  }
  
  const newScore = computeMeddiccScore(activeDeal.meddicc);
  const newSignal = deriveRiskSignal(activeDeal, newScore);
  
  updateCircularRingGauge(newScore);
  
  const modalScore = document.getElementById('m-score');
  const modalAdvice = document.getElementById('m-advice');
  if (modalScore) {
    modalScore.textContent = `${newScore}%`;
    modalScore.classList.remove('pulse-update');
    void modalScore.offsetWidth;
    modalScore.classList.add('pulse-update');
  }
  if (modalAdvice) modalAdvice.textContent = newSignal.text;
  
  const cellScore = document.getElementById(`cell-score-${activeDeal.id}`);
  const cellBar = document.getElementById(`cell-bar-${activeDeal.id}`);
  const cellSignal = document.getElementById(`cell-signal-${activeDeal.id}`);
  const rowEl = document.getElementById(`row-${activeDeal.id}`);
  
  let scoreColor = 'var(--semantic-emerald)';
  if (newScore < 70) scoreColor = 'var(--semantic-rose)';
  else if (newScore < 85) scoreColor = 'var(--semantic-amber)';
  
  if (cellScore) {
    cellScore.textContent = `${newScore}%`;
    cellScore.classList.remove('pulse-update');
    void cellScore.offsetWidth;
    cellScore.classList.add('pulse-update');
  }
  if (cellBar) {
    cellBar.style.width = `${newScore}%`;
    cellBar.style.background = scoreColor;
  }
  if (cellSignal) {
    cellSignal.style.color = newSignal.flagged ? 'var(--semantic-rose)' : 'var(--text-secondary)';
    cellSignal.textContent = newSignal.text;
  }
  if (rowEl) {
    rowEl.classList.remove('row-ripple-active');
    void rowEl.offsetWidth;
    rowEl.classList.add('row-ripple-active');
  }
  
  updateKpiSummary();
};

function closeInspectorDrawer() {
  const overlay = document.getElementById('inspector-overlay');
  if (overlay) overlay.classList.remove('open');
}
window.closeInspectorDrawer = closeInspectorDrawer;

function closeInspectorModal(e) {
  if (e.target.id === 'inspector-overlay') {
    closeInspectorDrawer();
  }
}
window.closeInspectorModal = closeInspectorModal;

/* 7. AI Agent Simulator */
window.runAiSimulator = function() {
  const inputEl = document.getElementById('sim-input');
  const outputCard = document.getElementById('sim-output-card');
  if (!inputEl || !outputCard) return;
  
  const text = inputEl.value.trim() || "CFO confirmed $750k budget is pre-approved for Q3 deployment.";
  
  outputCard.style.display = 'grid';
  document.getElementById('sim-status').textContent = "AI AGENT ANALYZING...";
  document.getElementById('sim-extracted-score').textContent = "Analyzing...";
  document.getElementById('sim-extracted-text').textContent = "Extracting MEDDICC parameters from transcript...";
  
  setTimeout(() => {
    const isBudget = text.toLowerCase().includes('budget') || text.toLowerCase().includes('cfo') || text.toLowerCase().includes('$');
    const score = isBudget ? 96 : 64;
    
    document.getElementById('sim-status').textContent = "ANALYSIS COMPLETE";
    document.getElementById('sim-extracted-score').textContent = `${score}% MEDDICC`;
    document.getElementById('sim-extracted-text').innerHTML = `
      <strong>Extracted Transcript:</strong> "${text}"<br>
      <strong>Signal:</strong> ${isBudget ? 'Economic Buyer & Budget Pre-Approved' : 'Missing Economic Buyer validation.'}
    `;
  }, 900);
};

/* 8. Re-Sync AI Agents Handler */
window.resyncAiAgents = function() {
  const btn = document.getElementById('btn-resync');
  if (btn) {
    btn.textContent = "Re-Syncing...";
    setTimeout(() => {
      btn.textContent = "Agents Re-Synced";
      renderTable(DEALS_DATABASE);
      setTimeout(() => { btn.textContent = "✨ Re-Sync Agents"; }, 2000);
    }, 700);
  }
};

/* 9. New Deal Creation Modal WITH STRICT NUMERIC VALIDATION */
function setupNewDealModal() {
  const modal = document.getElementById('new-deal-modal');
  if (!modal) return;
  
  window.openNewDealModal = function() { modal.style.display = 'flex'; };
  window.closeNewDealModal = function() { modal.style.display = 'none'; };
  
  const form = document.getElementById('new-deal-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const company = document.getElementById('nd-company').value.trim();
      const title = document.getElementById('nd-title').value.trim();
      const rawVal = document.getElementById('nd-val').value.replace(/[^0-9]/g, '');
      const owner = document.getElementById('nd-owner').value.trim();
      
      const val = parseInt(rawVal, 10);
      if (isNaN(val) || val <= 0) {
        alert("Please enter a valid numeric deal value (e.g. 350000).");
        return;
      }
      
      const newDeal = {
        id: `DEAL-${Math.floor(1000 + Math.random() * 9000)}`,
        company: company,
        title: title,
        value: val,
        owner: owner,
        stage: "Discovery",
        dotClass: "dot-discovery",
        meddicc: { metrics: 80, economicBuyer: 75, decisionCriteria: 85, decisionProcess: 70, identifyPain: 90, champion: 80, competition: 70 },
        citations: {
          metrics: "New deal value validated against sales quota.",
          economicBuyer: "Initial contact established; CFO validation pending.",
          decisionCriteria: "Standard evaluation criteria.",
          decisionProcess: "Discovery phase timeline.",
          identifyPain: "Primary pain point identified.",
          champion: "Champion assigned.",
          competition: "Competitive landscape mapped."
        },
        transcript: "Newly added deal via user portfolio form.",
        lastActivity: "Just now"
      };
      
      DEALS_DATABASE.unshift(newDeal);
      renderTable(DEALS_DATABASE);
      closeNewDealModal();
      form.reset();
    });
  }
}

/* 10. Navigation & Controls */
function setupNavTabs() {
  const tabs = document.querySelectorAll('.minimal-header .tab-btn');
  const panes = document.querySelectorAll('.section-pane');
  
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      
      t.classList.add('active');
      const target = t.dataset.target;
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add('active');
    });
  });
}

function setupFilters() {
  const searchInp = document.getElementById('search-input');
  const stageSelect = document.getElementById('select-stage');
  
  function apply() {
    const q = searchInp ? searchInp.value.toLowerCase() : '';
    const stage = stageSelect ? stageSelect.value : 'all';
    
    const res = DEALS_DATABASE.filter(d => {
      const matchQ = d.company.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || d.owner.toLowerCase().includes(q);
      const matchS = stage === 'all' || d.stage.toLowerCase() === stage.toLowerCase();
      return matchQ && matchS;
    });
    
    renderTable(res);
  }
  
  if (searchInp) searchInp.addEventListener('input', apply);
  if (stageSelect) stageSelect.addEventListener('change', apply);
}

/* 11. SINGLE CLEAN DARK / LIGHT MODE TOGGLE ENGINE */
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

/* 13. LIVE INTERACTIVE UI COMPONENT SANDBOX ENGINE FOR TAB 03 (NO JUMPING SCALE) */
function triggerTelemetryFlash(logEl) {
  if (!logEl) return;
  logEl.classList.remove('telemetry-update-flash');
  void logEl.offsetWidth;
  logEl.classList.add('telemetry-update-flash');
}

window.testDsButton = function(btnName) {
  const statusEl = document.getElementById('ds-sandbox-status');
  const logEl = document.getElementById('ds-telemetry-log');
  const time = new Date().toLocaleTimeString();
  
  if (statusEl) statusEl.textContent = `State: Triggered ${btnName}`;
  if (logEl) {
    logEl.innerHTML = `⚡ <strong>[${time}] Click Event:</strong> Triggered <code>${btnName}</code> button state successfully.`;
    triggerTelemetryFlash(logEl);
  }
};

window.switchDsSandboxTab = function(btnEl, tabName) {
  const container = document.getElementById('ds-sandbox-pills');
  if (container) {
    const btns = container.querySelectorAll('.sandbox-pill-btn');
    btns.forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  
  const statusEl = document.getElementById('ds-sandbox-status');
  const logEl = document.getElementById('ds-telemetry-log');
  const time = new Date().toLocaleTimeString();
  
  if (statusEl) statusEl.textContent = `State: Switched to ${tabName}`;
  if (logEl) {
    logEl.innerHTML = `🎛️ <strong>[${time}] Tab Switch Event:</strong> Switched active pill state to <code>${tabName}</code>.`;
    triggerTelemetryFlash(logEl);
  }
};

window.testDsBadge = function(stageName, colorHex) {
  const statusEl = document.getElementById('ds-sandbox-status');
  const logEl = document.getElementById('ds-telemetry-log');
  const time = new Date().toLocaleTimeString();
  
  if (statusEl) statusEl.textContent = `State: Selected Stage ${stageName}`;
  if (logEl) {
    logEl.innerHTML = `🏷️ <strong>[${time}] Stage Badge Event:</strong> Selected stage filter <code>${stageName}</code> (<span style="color:${colorHex}">● Active</span>).`;
    triggerTelemetryFlash(logEl);
  }
};

/* STRICT NUMERIC KEY VALIDATION & TOAST NOTIFICATION */
window.validateDsNumericKey = function(e) {
  const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (allowed.includes(e.key) || (e.ctrlKey || e.metaKey)) return;
  
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    showDsToast("⚠️ Non-numeric input blocked. Please enter numbers only (0-9).");
  }
};

function showDsToast(msg) {
  let toast = document.getElementById('ds-toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ds-toast-notification';
    toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:var(--semantic-amber); color:#000; font-weight:700; font-size:12.5px; padding:12px 20px; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.4); z-index:999; opacity:0; transition:opacity 0.25s ease; pointer-events:none; font-family:var(--font-heading);';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(window.dsToastTimer);
  window.dsToastTimer = setTimeout(() => {
    toast.style.opacity = '0';
  }, 2200);
}

window.onDsInputType = function(val) {
  const outputEl = document.getElementById('ds-input-output');
  const logEl = document.getElementById('ds-telemetry-log');
  const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
  
  const formatted = isNaN(num) ? '$0' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  
  if (outputEl) outputEl.textContent = formatted;
  if (logEl) {
    logEl.innerHTML = `🔢 <strong>Live Input Event:</strong> Formatted currency input to <code>${formatted}</code>.`;
    triggerTelemetryFlash(logEl);
  }
};

/* 12. DESIGN SYSTEM INTERACTIVE HELPERS */
window.updateDsFontScale = function(px) {
  const heading = document.getElementById('specimen-heading');
  const valSpan = document.getElementById('ds-scale-val');
  if (heading) heading.style.fontSize = `${px}px`;
  if (valSpan) valSpan.textContent = `${px}px`;
};

window.copyTokenValue = function(tokenName, hexVal) {
  const text = `${tokenName}: ${hexVal};`;
  navigator.clipboard.writeText(text);
  alert(`✓ Copied CSS token to clipboard:\n${text}`);
};

function setupTypeTester() {
  const input = document.getElementById('ds-type-tester');
  const heading = document.getElementById('specimen-heading');
  const body = document.getElementById('specimen-body');
  const mono = document.getElementById('specimen-mono');
  
  if (input) {
    input.addEventListener('input', (e) => {
      const val = e.target.value || "Autonomous Sales Agent Telemetry for Oliv.AI";
      if (heading) heading.textContent = val;
      if (body) body.textContent = `${val} • Designed to provide pristine readability and instant clarity for executive RevOps teams.`;
      if (mono) mono.textContent = `${val} • $1,250,000 • 98.4% MATCH`;
    });
  }
}

function setupCopyTokens() {
  const btn = document.getElementById('btn-copy-tokens');
  if (btn) {
    btn.addEventListener('click', () => {
      const tokens = `:root {
  --bg-canvas: #070A12;
  --bg-surface: #0F1523;
  --accent-brand: #5E5CE6;
  --accent-cyan: #0A84FF;
  --semantic-emerald: #30D158;
  --semantic-amber: #FFD60A;
  --semantic-rose: #FF453A;
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`;
      navigator.clipboard.writeText(tokens);
      btn.innerHTML = "<span>✓ Tokens Copied to Clipboard</span>";
      clearTimeout(window.copyTokensTimer);
      window.copyTokensTimer = setTimeout(() => {
        btn.innerHTML = "<span>📋 Export All Tokens for Devs</span>";
      }, 2000);
    });
  }
}

