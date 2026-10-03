(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const config = window.PORTFOLIO_ANALYTICS || {};
  const preferenceKey = 'portfolio-analytics-disabled';
  const readPreference = () => { try { return localStorage.getItem(preferenceKey) === 'true'; } catch { return false; } };
  let disabled = readPreference();
  const blockedByBrowser = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  let configured = false;
  try { configured = Boolean(config.websiteId && config.scriptUrl && new URL(config.scriptUrl).protocol === 'https:'); } catch { /* Analytics stays off. */ }
  const production = (config.domains || []).includes(location.hostname);
  const permitted = () => configured && production && !disabled && !blockedByBrowser;
  // This hook also cancels pageviews after opting out without requiring a reload.
  window.portfolioBeforeSend = (_type, payload) => permitted() ? payload : false;
  const track = (event, data = {}) => {
    if (!permitted() || !window.umami?.track) return;
    try { Promise.resolve(window.umami.track(event, data)).catch(() => {}); } catch { /* The site works if analytics is blocked. */ }
  };
  if (permitted()) {
    const script = document.createElement('script');
    script.src = config.scriptUrl;
    script.defer = true;
    script.dataset.websiteId = config.websiteId;
    script.dataset.domains = config.domains.join(',');
    script.dataset.excludeSearch = 'true';
    script.dataset.excludeHash = 'true';
    script.dataset.doNotTrack = 'true';
    script.dataset.beforeSend = 'portfolioBeforeSend';
    script.id = 'portfolio-analytics-script';
    document.head.appendChild(script);
  }
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-event]');
    if (link) track(link.dataset.event, link.dataset.project ? { project: link.dataset.project } : {});
  });
  $$('.case-study').forEach((details) => details.addEventListener('toggle', () => {
    if (details.open) track('case_study_open', { project: details.dataset.project });
  }));
  let category = 'All';
  const cards = $$('.project-card');
  const search = $('#project-search');
  const filterProjects = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matches = (category === 'All' || card.dataset.category === category) && card.dataset.search.toLocaleLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    $('#result-count').textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}${category === 'All' ? '' : ` · ${category}`}`;
    $('#empty-state').hidden = visible !== 0;
  };
  $$('.filter').forEach((button) => button.addEventListener('click', () => {
    category = button.dataset.filter;
    $$('.filter').forEach((filter) => { const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active)); });
    filterProjects();
    track('project_filter', { category });
  }));
  search.addEventListener('input', filterProjects); // Search terms remain in the browser.
  $('#reset-search').addEventListener('click', () => { search.value = ''; $('.filter[data-filter="All"]').click(); search.focus(); });
  filterProjects();
  const dialog = $('#privacy-dialog');
  const toggle = $('#analytics-toggle');
  const describePrivacy = () => {
    $('#privacy-description').textContent = configured
      ? 'This site is configured to use Umami for visit counts, referral information, and selected project and contact clicks. It does not send project search text or assign visitor identities.'
      : 'Visitor analytics are not currently enabled on this site.';
    toggle.hidden = !configured || !production || blockedByBrowser;
    toggle.textContent = disabled ? 'Allow analytics' : 'Turn analytics off';
    $('#privacy-status').textContent = blockedByBrowser ? 'Analytics are disabled by your browser privacy preference.' : (configured ? (disabled ? 'Analytics are turned off in this browser.' : (production ? 'Analytics are enabled unless blocked by your browser.' : 'Analytics are disabled on this preview.')) : 'No analytics requests are sent.');
  };
  $('#privacy-open').addEventListener('click', () => { describePrivacy(); dialog.showModal(); });
  $('#privacy-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  toggle.addEventListener('click', () => {
    disabled = !disabled;
    let saved = true;
    try { localStorage.setItem(preferenceKey, String(disabled)); } catch { saved = false; }
    if (!disabled && !$('#portfolio-analytics-script')) { if (saved) location.reload(); else { $('#privacy-status').textContent = 'Your browser could not save this preference. Analytics remain unloaded.'; return; } }
    describePrivacy();
    if (!saved) $('#privacy-status').textContent = 'Analytics are off for this visit. Your browser could not save the preference for future visits.';
  });

  const listingA = $('#listing-a');
  const listingB = $('#listing-b');
  const pairs = {
    same: ['Sony WH-1000XM5 Black', 'Sony Black WH-1000XM5'],
    model: ['Sony WH-1000XM5 Black', 'Sony WH-1000XM4 Black'],
    storage: ['Apple iPhone 15 128GB Black', 'Apple iPhone 15 256GB Black']
  };
  const words = (title) => new Set(title.toLowerCase().match(/[a-z0-9]+(?:-[a-z0-9]+)*/g) || []);
  const attributes = (title) => {
    const text = title.toLowerCase();
    const storage = text.match(/\b(\d+)\s*(gb|tb)\b/);
    const model = text.match(/\bwh-?1000xm\d+\b|\biphone\s+\d+(?:\s+pro(?:\s+max)?)?\b|\bgalaxy\s+s\d+(?:\s+ultra)?\b/);
    const color = text.match(/\b(black|white|blue|red|green|silver|gold|pink|purple)\b/);
    return { model: model?.[0].replace(/[^a-z0-9]/g, ''), storage: storage ? Number(storage[1]) * (storage[2] === 'tb' ? 1024 : 1) : undefined, color: color?.[0] };
  };
  const compareTitles = () => {
    const a = words(listingA.value), b = words(listingB.value);
    const union = new Set([...a, ...b]);
    const shared = [...a].filter(word => b.has(word)).length;
    const overlap = union.size ? Math.round(100 * shared / union.size) : 0;
    const aa = attributes(listingA.value), bb = attributes(listingB.value);
    const conflicts = Object.keys(aa).filter(key => aa[key] !== undefined && bb[key] !== undefined && aa[key] !== bb[key]);
    $('#demo-overlap').textContent = `${overlap}%`;
    $('#demo-meter-fill').style.width = `${overlap}%`;
    $('#demo-conflicts').textContent = String(conflicts.length);
    const result = $('#demo-result');
    result.classList.toggle('has-conflict', conflicts.length > 0);
    result.textContent = !a.size || !b.size ? 'Enter two product titles to compare.' : conflicts.length ? `Attribute conflict: ${conflicts.join(' and ')}.` : 'No conflict found in the supported attributes. This does not confirm a match.';
  };
  if (listingA && listingB) {
    [listingA, listingB].forEach(input => input.addEventListener('input', compareTitles));
    $$('[data-pair]').forEach(button => button.addEventListener('click', () => {
      [listingA.value, listingB.value] = pairs[button.dataset.pair];
      compareTitles();
    }));
    compareTitles();
  }
})();
