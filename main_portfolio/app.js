/* ==========================================================================
   SOHAIB AHMER AVANT-GARDE MASTER PORTFOLIO HUB ENGINE
   Designer: Sohaib Ahmer (NID Postgraduate Alumnus)
   Features: Hand-Drawn Line-Art Cat & Dynamic Yarn-Tracking Rise Physics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initZipperEngine();
  initEmotionalCatScrollbarEngine();
  setupThemeEngine();
  setupHeaderNavObserver();
});

/* ==========================================================================
   1. ZIPPER CURTAIN UNVEILING ENGINE (FIRST VISIT ONLY VIA SESSION STORAGE)
   ========================================================================== */
function initZipperEngine() {
  const overlay = document.getElementById('zipper-curtain-overlay');
  const handle = document.getElementById('zipper-handle');
  const leftPanel = document.getElementById('curtain-left');
  const rightPanel = document.getElementById('curtain-right');

  if (!overlay || !handle) return;

  if (sessionStorage.getItem('hasUnzipped') === 'true') {
    overlay.classList.add('hidden');
    return;
  }

  let isDragging = false;
  let startY = 0;
  let currentY = 0;

  const onStart = (e) => {
    isDragging = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    handle.style.transition = 'none';
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = Math.max(0, clientY - startY);
    currentY = deltaY;

    handle.style.transform = `translate(-50%, ${deltaY}px)`;

    const progress = Math.min(deltaY / 400, 1);
    leftPanel.style.transform = `translateX(${-progress * 40}vw) rotate(${-progress * 15}deg)`;
    rightPanel.style.transform = `translateX(${progress * 40}vw) rotate(${progress * 15}deg)`;

    if (deltaY > 160) {
      triggerCurtainDrop();
      isDragging = false;
    }
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    if (currentY <= 160) {
      handle.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      handle.style.transform = 'translate(-50%, 0px)';
      leftPanel.style.transform = 'none';
      rightPanel.style.transform = 'none';
    }
  };

  handle.addEventListener('click', triggerCurtainDrop);
  handle.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  handle.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  function triggerCurtainDrop() {
    sessionStorage.setItem('hasUnzipped', 'true');
    leftPanel.classList.add('curtain-fall-left');
    rightPanel.classList.add('curtain-fall-right');
    handle.style.display = 'none';
    const seam = document.querySelector('.zipper-seam-container');
    if (seam) seam.style.display = 'none';

    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 350);
  }
}

function initEmotionalCatScrollbarEngine() {
  const runner = document.getElementById('peeking-character-runner');
  const headGroup = document.getElementById('hand-drawn-head-group');
  const raisedPaw = document.getElementById('hand-drawn-raised-paw');
  const yarnBall = document.getElementById('woollen-yarn-scrollbar-ball');
  const yarnThreadLine = document.getElementById('unraveling-thread-line');
  const leftPupil = document.getElementById('left-pupil');
  const leftShine = document.getElementById('left-shine');
  const rightPupil = document.getElementById('right-pupil');
  const rightShine = document.getElementById('right-shine');
  const speechBubble = document.getElementById('cat-speech-bubble');

  if (!runner || !yarnBall || !headGroup || !raisedPaw) return;

  let isDraggingYarn = false;
  let customX = null;
  let customY = null;
  let dragOffset = { x: 0, y: 0 };
  let bubbleTimeout = null;

  function getDefaultYarnTop() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
    const minTop = 100;
    const maxTop = window.innerHeight - 140;
    return minTop + scrollPercent * (maxTop - minTop);
  }

  function updateYarnAndCat() {
    const defaultTop = getDefaultYarnTop();
    const defaultX = window.innerWidth - 60;

    const currentX = (customX !== null) ? customX : defaultX;
    const currentY = (customY !== null) ? customY : defaultTop;

    // Move yarn ball
    yarnBall.style.left = `${currentX}px`;
    yarnBall.style.top = `${currentY}px`;

    // Draw unrolling Bezier thread SVG line
    if (yarnThreadLine) {
      const startX = window.innerWidth - 40;
      const cp1X = startX;
      const cp1Y = currentY * 0.5;
      const cp2X = currentX + 20;
      const cp2Y = currentY * 0.5;
      const endX = currentX + 20;
      const endY = currentY + 20;

      yarnThreadLine.setAttribute('d', `M${startX} 0 C${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`);
    }

    // CAT EYE & PUPIL EYE-TRACKING PHYSICS
    const catRect = runner.getBoundingClientRect();
    const catCenterX = catRect.left + 50;
    const catCenterY = catRect.top + 45;

    const deltaX = (currentX + 20) - catCenterX;
    const deltaY = (currentY + 20) - catCenterY;
    const angle = Math.atan2(deltaY, deltaX);
    const dist = Math.hypot(deltaX, deltaY);

    const pupilShiftDist = Math.min(dist / 40, 5.5);
    const pupilX = Math.cos(angle) * pupilShiftDist;
    const pupilY = Math.sin(angle) * pupilShiftDist;

    if (leftPupil && leftShine) {
      leftPupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      leftShine.style.transform = `translate(${pupilX * 0.5}px, ${pupilY * 0.5}px)`;
    }
    if (rightPupil && rightShine) {
      rightPupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      rightShine.style.transform = `translate(${pupilX * 0.5}px, ${pupilY * 0.5}px)`;
    }

    // CAT HEAD & PAW REACTIVE SWIPE PHYSICS
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;

    const headRiseY = 15 - (scrollPercent * 70);
    const headAngleDeg = Math.max(-25, Math.min(25, (angle * 180 / Math.PI) + 90));
    headGroup.style.transform = `translateY(${headRiseY}px) rotate(${headAngleDeg * 0.3}deg)`;

    const basePawY = 25 - (scrollPercent * 75);
    const pawAngleDeg = Math.max(-65, Math.min(25, (angle * 180 / Math.PI) - 90));

    if (dist < 150) {
      raisedPaw.style.transform = `translateY(${basePawY - 22}px) rotate(${pawAngleDeg}deg) scale(1.2)`;
      showCatBubble(dist < 75 ? "Gotcha! 🐾" : "Swiping! 🧶");
    } else {
      raisedPaw.style.transform = `translateY(${basePawY}px) rotate(${pawAngleDeg * 0.4}deg)`;
      if (!isDraggingYarn) hideCatBubble();
    }
  }

  function showCatBubble(text) {
    if (!speechBubble) return;
    speechBubble.textContent = text;
    speechBubble.classList.add('active');
    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      speechBubble.classList.remove('active');
    }, 2200);
  }

  function hideCatBubble() {
    if (!speechBubble) return;
    speechBubble.classList.remove('active');
  }

  // DRAGGING EVENT HANDLERS
  const onStart = (e) => {
    isDraggingYarn = true;
    yarnBall.classList.add('dragging');
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = yarnBall.getBoundingClientRect();
    dragOffset.x = clientX - rect.left;
    dragOffset.y = clientY - rect.top;
    showCatBubble("Playing! 🧶");
  };

  const onMove = (e) => {
    if (!isDraggingYarn) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    customX = Math.max(10, Math.min(window.innerWidth - 60, clientX - dragOffset.x));
    customY = Math.max(10, Math.min(window.innerHeight - 60, clientY - dragOffset.y));
    updateYarnAndCat();
  };

  const onEnd = () => {
    if (!isDraggingYarn) return;
    isDraggingYarn = false;
    yarnBall.classList.remove('dragging');
    showCatBubble("Wheee! 🐾");
    
    // Smoothly return yarn ball to scrollbar track
    let returnFrame = 0;
    const initialCustomX = customX;
    const initialCustomY = customY;
    const duration = 25; // 25 frames (~400ms)

    function animateReturn() {
      if (isDraggingYarn) return;
      returnFrame++;
      const progress = returnFrame / duration;
      const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      if (progress < 1) {
        const defaultTop = getDefaultYarnTop();
        const defaultX = window.innerWidth - 60;
        customX = initialCustomX + (defaultX - initialCustomX) * ease;
        customY = initialCustomY + (defaultTop - initialCustomY) * ease;
        updateYarnAndCat();
        requestAnimationFrame(animateReturn);
      } else {
        customX = null;
        customY = null;
        updateYarnAndCat();
      }
    }

    requestAnimationFrame(animateReturn);
  };

  yarnBall.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  yarnBall.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  window.addEventListener('scroll', () => {
    if (!isDraggingYarn) updateYarnAndCat();
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!isDraggingYarn) updateYarnAndCat();
  });

  // Initial render
  updateYarnAndCat();
}

/* ==========================================================================
   3. TICKET NAV OBSERVER & THEME ENGINE
   ========================================================================== */
function setupHeaderNavObserver() {
  const links = document.querySelectorAll('.ticket-nav-link');
  const sections = document.querySelectorAll('section[id]');
  let isManualScrolling = false;
  let scrollTimeout = null;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        isManualScrolling = true;

        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const headerOffset = 110;
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

  const observer = new IntersectionObserver((entries) => {
    if (isManualScrolling) return;
    entries.forEach(entry => {
      if (entry.target.isIntersecting) {
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
