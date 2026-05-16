'use strict';

/* ── Reference data ── */
const REFS = [
  {
    id: 'Norman1988',
    text: 'Norman, D. A. (1988). <em>The design of everyday things</em>. Basic Books.',
    url: 'https://mitpress.mit.edu/9780262525671/the-design-of-everyday-things/'
  },
  {
    id: 'Engestrom1987',
    text: 'Engeström, Y. (1987). <em>Learning by expanding: An activity-theoretical approach to developmental research</em>. Orienta-Konsultit.',
    url: 'https://lchc.ucsd.edu/mca/Paper/Engestrom/expanding/toc.htm'
  },
  {
    id: 'Engestrom2001',
    text: 'Engeström, Y. (2001). Expansive learning at work: Toward an activity-theoretical reconceptualization. <em>Journal of Education and Work</em>, 14(1), 133–156.',
    url: 'https://www.tandfonline.com/doi/abs/10.1080/13639080123238'
  },
  {
    id: 'Shen2023',
    text: 'Shen, Y., et al. (2023). Bridging the Gulf of Envisioning: Cognitive challenges in prompt-based interactions with large language models. <em>arXiv</em>.',
    url: 'https://arxiv.org/abs/2309.14459'
  },
  {
    id: 'Weisz2024',
    text: 'Weisz, J. D., et al. (2024). Designing human–AI interaction with generative models. <em>Communications of the ACM</em>.',
    url: 'https://dl.acm.org/doi/10.1145/3613904.3642466'
  },
  {
    id: 'Bitner2008',
    text: 'Bitner, M. J., Ostrom, A. L., &amp; Morgan, F. N. (2008). Service blueprinting: A practical technique for service innovation. <em>California Management Review</em>, 50(3), 66–94.',
    url: 'https://doi.org/10.2307/41166446'
  },
  {
    id: 'HPT2024',
    text: 'Hierarchical Prompting Taxonomy. (2024). <em>arXiv</em>.',
    url: 'https://arxiv.org/abs/2406.12644'
  },
  {
    id: 'Bennett2014',
    text: 'Bennett, A., &amp; Checkel, J. T. (2014). <em>Process tracing and the social sciences</em>. Cambridge University Press.',
    url: 'https://www.cambridge.org/core/books/process-tracing/5BBC24CBF2E89114817741D0476C07A9'
  }
];

const REFS_MAP = Object.fromEntries(REFS.map(r => [r.id, r]));

/* ── Theme ── */
function initTheme() {
  const saved = localStorage.getItem('theme');
  applyTheme(saved || 'light');

  document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

/* ── TOC mobile toggle ── */
function initTocToggle() {
  const btn = document.getElementById('tocToggle');
  const nav = document.getElementById('tocNav');

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('collapsed', isOpen);
  });
}

/* ── Scroll-spy ── */
function initScrollSpy() {
  const TOPBAR_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) || 52;
  const sections = Array.from(document.querySelectorAll('section[id], .abstract-section[id]'));
  const links    = document.querySelectorAll('.toc-link');

  if (!sections.length || !links.length) return;

  function getActive() {
    const offset = TOPBAR_H + 96;
    let active = sections[0];
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= offset) active = sec;
      else break;
    }
    return active;
  }

  function update() {
    const active = getActive();
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + active.id);
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
  }, { passive: true });

  update();
}

/* ── Citation popovers ── */
function initPopovers() {
  const popover  = document.getElementById('citationPopover');
  const popText  = document.getElementById('popoverText');
  const popLink  = document.getElementById('popoverLink');
  let hideTimer  = null;
  let activeCite = null;

  function show(cite) {
    const ref = REFS_MAP[cite.dataset.ref];
    if (!ref) return;
    clearTimeout(hideTimer);
    activeCite = cite;

    popText.innerHTML = ref.text;
    popLink.href = ref.url;

    popover.removeAttribute('hidden');
    popover.classList.remove('visible');

    // Force reflow then animate in
    void popover.offsetWidth;
    position(cite);
    popover.classList.add('visible');
  }

  function hide(delay = 0) {
    hideTimer = setTimeout(() => {
      popover.classList.remove('visible');
      setTimeout(() => {
        if (!popover.classList.contains('visible')) {
          popover.setAttribute('hidden', '');
        }
      }, 200);
      activeCite = null;
    }, delay);
  }

  function position(cite) {
    const rect = cite.getBoundingClientRect();
    const pw = 340;
    const ph = popover.offsetHeight || 110;
    const gap = 10;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = rect.left;
    if (left + pw > vw - 12) left = vw - pw - 12;
    if (left < 12) left = 12;

    // Prefer above; fall back to below
    let top = rect.top - ph - gap;
    if (top < 8) top = rect.bottom + gap;
    if (top + ph > vh - 8) top = rect.top - ph - gap;

    popover.style.left = left + 'px';
    popover.style.top  = top  + 'px';
  }

  // Wire up each cite span
  document.querySelectorAll('.cite').forEach(cite => {
    cite.addEventListener('mouseenter', () => show(cite));
    cite.addEventListener('mouseleave', () => hide(200));
    cite.addEventListener('click', e => {
      e.stopPropagation();
      if (activeCite === cite && !popover.hasAttribute('hidden')) { hide(0); }
      else { show(cite); }
    });
    cite.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(cite); }
      if (e.key === 'Escape') hide(0);
    });
  });

  popover.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  popover.addEventListener('mouseleave', () => hide(150));

  document.addEventListener('click', () => hide(0));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(0); });
}

/* ── Copy buttons ── */
const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.code-block').querySelector('code');
      const text = code.textContent;

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      const textSpan = btn.querySelector('.copy-text');
      const prevHTML = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = CHECK_ICON + (textSpan ? '<span class="copy-text">Copiado!</span>' : '');

      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = prevHTML;
      }, 2000);
    });
  });
}

/* ── Populate references section ── */
function populateReferences() {
  const list = document.getElementById('referencesList');
  if (!list) return;

  REFS.forEach(ref => {
    const li = document.createElement('li');
    li.innerHTML = `${ref.text} <a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.url}</a>`;
    list.appendChild(li);
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTocToggle();
  initScrollSpy();
  initPopovers();
  initCopyButtons();
  populateReferences();
});
