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
  const stages = {
    capture: ['Python SDK → API', 'Capture the context.', 'The SDK records structured events and delivers telemetry in the background. Shared trace IDs connect steps in a workflow.'],
    persist: ['API → PostgreSQL', 'Keep the workflow together.', 'The backend stores events and trace context in PostgreSQL, so related steps can be inspected after the original call completes.'],
    inspect: ['Stored events → dashboard', 'Inspect behavior, not just output.', 'The dashboard surfaces usage, latency, cost estimates, and heuristic alerts. These signals support investigation; they do not prove factual correctness.']
  };
  $$('.stage').forEach((button) => button.addEventListener('click', () => {
    $$('.stage').forEach((stage) => { const active = stage === button; stage.classList.toggle('active', active); stage.setAttribute('aria-pressed', String(active)); });
    const [label, title, text] = stages[button.dataset.stage];
    const description = $('#stage-description');
    description.querySelector('.mini-label').textContent = label;
    description.querySelector('h4').textContent = title;
    description.querySelector('p').textContent = text;
    track('architecture_step', { step: button.dataset.stage });
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
})();
