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


  const runButton = $('#guardian-run');
  const resetButton = $('#guardian-reset');
  const scenario = $('#guardian-scenario');
  if (runButton && resetButton && scenario) {
    const samples = {
      workflow: [
        { name: '1. Extract the policy', prompt: 'Extract the return window and conditions from the store policy.', output: '30-day return window. Opened items accepted. Proof of purchase required.', tokens: 240, latency: 420 },
        { name: '2. Draft the answer', prompt: 'Use the policy to answer: can opened headphones be returned after 20 days?', output: 'Yes. The return is within 30 days, and opened items are accepted. Bring proof of purchase.', tokens: 680, latency: 1180 },
        { name: '3. Compare answer with policy', prompt: 'Compare the draft with the supplied policy and identify missing conditions.', output: 'The draft includes the return window, opened-item condition, and proof-of-purchase requirement.', tokens: 190, latency: 310 }
      ],
      single: [{ name: '1. Summarize the policy', prompt: 'Summarize: returns within 30 days; opened items accepted with proof of purchase.', output: 'Return opened or unopened items within 30 days with proof of purchase.', tokens: 410, latency: 850 }]
    };
    let events = [];
    let generation = 0;
    let runCount = 0;
    let timer = null;
    const paint = () => {
      $('#guardian-count').textContent = String(events.length);
      $('#guardian-tokens').textContent = events.reduce((sum, event) => sum + event.tokens, 0).toLocaleString();
      $('#guardian-latency').textContent = events.length ? Math.round(events.reduce((sum, event) => sum + event.latency, 0) / events.length) + ' ms' : '—';
    };
    const unlock = () => { runButton.disabled = false; scenario.disabled = false; };
    resetButton.addEventListener('click', () => {
      generation += 1;
      clearTimeout(timer);
      events = [];
      runCount = 0;
      $('#guardian-feed').replaceChildren();
      const empty = document.createElement('li');
      empty.className = 'guardian-empty';
      empty.textContent = 'Run an example to see its requests appear here.';
      $('#guardian-feed').appendChild(empty);
      $('#guardian-trace').textContent = 'Ready to run';
      $('#guardian-status').textContent = 'No events yet.';
      unlock();
      paint();
    });
    runButton.addEventListener('click', () => {
      const currentGeneration = ++generation;
      const selected = samples[scenario.value];
      events = [];
      paint();
      const traceId = 'demo-' + String(++runCount).padStart(2, '0');
      runButton.disabled = true;
      scenario.disabled = true;
      $('#guardian-feed').replaceChildren();
      $('#guardian-trace').textContent = traceId;
      track('guardian_demo_run', { scenario: scenario.value });
      let step = 0;
      const next = () => {
        if (currentGeneration !== generation) return;
        if (step === selected.length) {
          $('#guardian-status').textContent = scenario.value === 'workflow' ? 'What this trace reveals: drafting the answer took 1,180 ms, the slowest call, and used 680 of 1,110 tokens. A developer can start investigating that step. The policy check is an example model output, not a verified safety guarantee.' : 'What this trace reveals: the summary used one model call, 410 sample tokens, and 850 ms. Guardian records the call; the assistant produces the answer.';
          unlock();
          return;
        }
        const event = selected[step];
        const row = document.createElement('li');
        row.className = 'guardian-event pending';
        const heading = document.createElement('div');
        heading.className = 'guardian-event-heading';
        const name = document.createElement('strong');
        name.textContent = event.name;
        const badge = document.createElement('span');
        badge.textContent = 'In progress';
        heading.append(name, badge);
        const detail = document.createElement('p');
        detail.textContent = 'Input: ' + event.prompt;
        const bar = document.createElement('div');
        bar.className = 'guardian-event-bar';
        const fill = document.createElement('span');
        bar.appendChild(fill);
        const output = document.createElement('p');
        output.className = 'guardian-output-text';
        const telemetry = document.createElement('small');
        row.append(heading, detail, output, telemetry, bar);
        $('#guardian-feed').appendChild(row);
        $('#guardian-status').textContent = 'Replaying step ' + (step + 1) + ' of ' + selected.length + '…';
        timer = setTimeout(() => {
          if (currentGeneration !== generation) return;
          row.classList.remove('pending');
          badge.textContent = 'Tracked';
          output.textContent = 'Output: ' + event.output;
          telemetry.textContent = 'Recorded by Guardian: ' + event.tokens + ' tokens · ' + event.latency + ' ms (sample data)';
          fill.style.width = Math.round(event.latency / 1200 * 100) + '%';
          events.push({ ...event, traceId });
          paint();
          step += 1;
          next();
        }, 650);
      };
      next();
    });
  }
})();
