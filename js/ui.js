/**
 * ui.js - UI渲染模块
 * Local AI Checker - UI Rendering Module
 *
 * Renders hardware cards, model table, filters, and detail expansions.
 * Uses vanilla DOM manipulation — no framework.
 */

const UI = {

  // Cached DOM references
  _app: null,
  _state: {
    filter: 'all',      // all | green | yellow | red | gray
    category: 'all',
    size: 'all',
    sort: 'default',
    search: '',
    expandedRow: null,
    lang: 'zh'
  },

  // ──────────────────────────────────────────────
  //  Initialization
  // ──────────────────────────────────────────────
  init() {
    this._app = document.getElementById('app');
    this._state.lang = I18N.getLang();
  },

  // ──────────────────────────────────────────────
  //  Full Page Render
  // ──────────────────────────────────────────────
  renderAll(hardware, results) {
    this._app.innerHTML = '';
    this._app.appendChild(this._renderHeader());
    this._app.appendChild(this._renderStatus(hardware));
    this._app.appendChild(this._renderWarning(hardware));
    this._app.appendChild(this._renderCards(hardware));
    this._app.appendChild(this._renderModelSection(results));
    this._app.appendChild(this._renderFooter());
  },

  renderSkeleton() {
    this._app.innerHTML = `
      <div class="container" style="padding-top: 80px; text-align: center;">
        <div class="spinner" style="width: 40px; height: 40px; border-width: 3px;"></div>
        <p style="margin-top: 20px; color: var(--text-secondary);">${I18N.t('detecting')}</p>
      </div>
    `;
  },

  showError(msg) {
    this._app.innerHTML = `
      <div class="container" style="padding-top: 80px; text-align: center;">
        <p style="color: var(--red); font-size: 1.2rem;">❌ ${msg}</p>
        <button class="btn btn-primary" style="margin-top: 20px;" onclick="location.reload()">
          ${I18N.t('detectBtn')}
        </button>
      </div>
    `;
  },

  // ──────────────────────────────────────────────
  //  Header
  // ──────────────────────────────────────────────
  _renderHeader() {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
      <div class="container">
        <div class="header-inner">
          <div class="header-left">
            <h1>🖥️ ${I18N.t('title')}</h1>
            <p class="subtitle">${I18N.t('subtitle')}</p>
          </div>
          <div class="header-right">
            <button class="btn" id="btn-lang" title="${I18N.t('langToggle')}">
              🌐 ${I18N.t('langToggle')}
            </button>
            <button class="btn btn-primary" id="btn-redetect">
              ${I18N.t('detectBtn')}
            </button>
          </div>
        </div>
      </div>
    `;

    // Event: Language toggle
    header.querySelector('#btn-lang').addEventListener('click', () => {
      I18N.toggleLang();
      window.location.reload();
    });

    // Event: Re-detect
    header.querySelector('#btn-redetect').addEventListener('click', () => {
      window.location.reload();
    });

    return header;
  },

  // ──────────────────────────────────────────────
  //  Status Bar
  // ──────────────────────────────────────────────
  _renderStatus(hardware) {
    const hasWarnings = hardware.warnings.length > 0;
    const div = document.createElement('div');
    div.className = `container fade-in`;
    div.innerHTML = `
      <div class="status-bar ${hasWarnings ? 'warning' : 'success'}">
        <span class="status-icon">${hasWarnings ? '⚠️' : '✅'}</span>
        <span>${I18N.t(hasWarnings ? 'detectWarning' : 'detectDone')}</span>
        <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: auto;">
          ${I18N.t('detectionSource')}: ${hardware.gpu.source} | ${I18N.t('confidence')}: ${I18N.t('confidence' + (hardware.gpu.confidence === 'exact' ? 'High' : hardware.gpu.confidence === 'fallback' ? 'Low' : 'Medium'))}
        </span>
      </div>
    `;
    return div;
  },

  // ──────────────────────────────────────────────
  //  Warnings
  // ──────────────────────────────────────────────
  _renderWarning(hardware) {
    if (!hardware.warnings.length) return document.createTextNode('');

    const div = document.createElement('div');
    div.className = 'container fade-in';
    div.innerHTML = hardware.warnings.map(w =>
      `<div class="warning-msg">⚠️ ${I18N.t(w)}</div>`
    ).join('');
    return div;
  },

  // ──────────────────────────────────────────────
  //  Hardware Cards
  // ──────────────────────────────────────────────
  _renderCards(hardware) {
    const { cpu, gpu, ram, disk, os } = hardware;

    const cards = [
      {
        icon: '🖥️', title: 'cpuTitle',
        value: `${cpu.cores} ${I18N.t('logicalCores')}`,
        sub: `${os.name} ${os.is64Bit ? '64-bit' : '32-bit'} · ${cpu.arch || ''}`,
        badge: cpu.tier, badgeClass: cpu.cores >= 16 ? 'badge-high' : cpu.cores >= 8 ? 'badge-medium' : 'badge-low'
      },
      {
        icon: '🎮', title: 'gpuTitle',
        value: gpu.shared && !gpu.unified ? I18N.t('integrated') : gpu.name,
        sub: gpu.vram > 0 ? `${gpu.vram} GB ${I18N.t('vramLabel')}` : (gpu.unified ? I18N.t('sharedMemory') : I18N.t('unknown')),
        badge: gpu.tier, badgeClass: gpu.tier === 'ultra-high' || gpu.tier === 'workstation' ? 'badge-high' : gpu.tier === 'high' || gpu.tier === 'unified' ? 'badge-medium' : gpu.tier === 'mid' ? 'badge-medium' : 'badge-low'
      },
      {
        icon: '🧠', title: 'ramTitle',
        value: (ram.total || ram.estimated) + ' GB',
        sub: `${ram.source === 'deviceMemory' ? '✅ ' : '⚠️ '}${ram.source}`,
        badge: ram.confidence, badgeClass: ram.confidence === 'medium' ? 'badge-medium' : 'badge-low'
      },
      {
        icon: '💾', title: 'diskTitle',
        value: disk.quotaGB ? `${disk.availableGB || disk.quotaGB} GB` : I18N.t('unknown'),
        sub: I18N.t('browserQuota'),
        badge: 'browser', badgeClass: 'badge-info'
      },
      {
        icon: '⚙️', title: 'osTitle',
        value: os.name,
        sub: os.is64Bit ? '64-bit' : '32-bit',
        badge: os.name, badgeClass: 'badge-info'
      }
    ];

    const section = document.createElement('div');
    section.className = 'container fade-in';

    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    cards.forEach(c => {
      const card = document.createElement('div');
      card.className = 'hw-card';
      card.innerHTML = `
        <div class="hw-card-icon">${c.icon}</div>
        <div class="hw-card-title">${I18N.t(c.title)}</div>
        <div class="hw-card-value">${c.value}</div>
        <div class="hw-card-sub">${c.sub}</div>
        <span class="hw-card-badge ${c.badgeClass}">${typeof c.badge === 'string' ? I18N.t(c.badge) || c.badge : c.badge}</span>
      `;
      grid.appendChild(card);
    });

    section.appendChild(grid);
    return section;
  },

  // ──────────────────────────────────────────────
  //  Model Section (table + toolbar)
  // ──────────────────────────────────────────────
  _renderModelSection(results) {
    const section = document.createElement('div');
    section.className = 'container fade-in';
    section.style.marginTop = '32px';

    // Section title
    const titleDiv = document.createElement('div');
    titleDiv.style.display = 'flex';
    titleDiv.style.alignItems = 'center';
    titleDiv.style.marginBottom = '16px';
    titleDiv.innerHTML = `<h2 class="section-title" style="margin-bottom:0;">📊 ${I18N.t('modelTable')}</h2>`;
    section.appendChild(titleDiv);

    // Toolbar
    section.appendChild(this._renderToolbar(results));

    // Table
    section.appendChild(this._renderTable(results));

    return section;
  },

  _renderToolbar(results) {
    const stats = MATCHER.getStats(results);

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
      <input type="text" class="search-input" id="search-input" placeholder="${I18N.t('searchPlaceholder')}">

      <select class="filter-select" id="filter-status">
        <option value="all">${I18N.t('filterAll')} (${stats.total})</option>
        <option value="green">${I18N.t('filterRuns')} (${stats.green})</option>
        <option value="yellow">${I18N.t('filterLimited')} (${stats.yellow})</option>
        <option value="red">${I18N.t('filterCannot')} (${stats.red})</option>
        <option value="gray">${I18N.t('filterUnknown')} (${stats.gray})</option>
      </select>

      <select class="filter-select" id="filter-category">
        <option value="all">${I18N.t('categoryAll')}</option>
        <option value="chat">${I18N.t('categoryChat')}</option>
        <option value="coding">${I18N.t('categoryCoding')}</option>
        <option value="reasoning">${I18N.t('categoryReasoning')}</option>
        <option value="vision">${I18N.t('categoryVision')}</option>
        <option value="embedding">${I18N.t('categoryEmbedding')}</option>
        <option value="lightweight">🚀 ${I18N.t('sizeUltraLight')}</option>
      </select>

      <select class="filter-select" id="filter-size">
        <option value="all">${I18N.t('sizeAll')}</option>
        <option value="ultra-light">${I18N.t('sizeUltraLight')}</option>
        <option value="light">${I18N.t('sizeLight')}</option>
        <option value="mid">${I18N.t('sizeMid')}</option>
        <option value="heavy">${I18N.t('sizeHeavy')}</option>
        <option value="ultra">${I18N.t('sizeUltra')}</option>
      </select>

      <select class="filter-select" id="filter-sort">
        <option value="default">${I18N.t('sortDefault')}</option>
        <option value="name">${I18N.t('sortName')}</option>
        <option value="params">${I18N.t('sortParams')}</option>
      </select>
    `;

    // Defer event binding
    setTimeout(() => this._bindToolbarEvents(toolbar, results), 0);

    return toolbar;
  },

  _bindToolbarEvents(toolbar, results) {
    const searchInput = toolbar.querySelector('#search-input');
    const statusFilter = toolbar.querySelector('#filter-status');
    const categoryFilter = toolbar.querySelector('#filter-category');
    const sizeFilter = toolbar.querySelector('#filter-size');
    const sortFilter = toolbar.querySelector('#filter-sort');

    const update = () => {
      this._state.filter = statusFilter.value;
      this._state.category = categoryFilter.value;
      this._state.size = sizeFilter.value;
      this._state.sort = sortFilter.value;
      this._state.search = searchInput.value.toLowerCase();
      this._refreshTable(results);
    };

    searchInput.addEventListener('input', update);
    statusFilter.addEventListener('change', update);
    categoryFilter.addEventListener('change', update);
    sizeFilter.addEventListener('change', update);
    sortFilter.addEventListener('change', update);
  },

  _filterResults(results) {
    let filtered = [...results];
    const s = this._state;

    // Status filter
    if (s.filter !== 'all') {
      filtered = filtered.filter(r => r.level === s.filter);
    }

    // Category filter
    if (s.category !== 'all') {
      if (s.category === 'lightweight') {
        filtered = filtered.filter(r => r.model.params <= 3.5);
      } else {
        filtered = filtered.filter(r => r.model.tags.includes(s.category));
      }
    }

    // Size filter
    if (s.size !== 'all') {
      const sizeRanges = {
        'ultra-light': [0, 3.5],
        'light': [3.5, 10],
        'mid': [10, 20],
        'heavy': [20, 45],
        'ultra': [45, Infinity]
      };
      const [min, max] = sizeRanges[s.size] || [0, Infinity];
      filtered = filtered.filter(r => r.model.params >= min && r.model.params < max);
    }

    // Search
    if (s.search) {
      const q = s.search;
      filtered = filtered.filter(r =>
        r.model.name.toLowerCase().includes(q) ||
        r.model.family.toLowerCase().includes(q) ||
        r.model.org.toLowerCase().includes(q) ||
        r.model.tags.some(t => t.includes(q)) ||
        (r.model.description?.zh || '').includes(q) ||
        (r.model.description?.en || '').includes(q)
      );
    }

    // Sort
    if (s.sort === 'name') {
      filtered.sort((a, b) => a.model.name.localeCompare(b.model.name));
    } else if (s.sort === 'params') {
      filtered.sort((a, b) => a.model.params - b.model.params);
    }
    // default = keep sorted by compatibility level, then params

    return filtered;
  },

  _refreshTable(results) {
    const tableBody = document.getElementById('model-table-body');
    const modelCount = document.getElementById('model-count-display');
    if (!tableBody) return;

    const filtered = this._filterResults(results);
    tableBody.innerHTML = '';
    filtered.forEach((r, i) => {
      tableBody.appendChild(this._renderRow(r, i));
    });

    if (modelCount) {
      modelCount.textContent = `${I18N.t('showingModels')} ${filtered.length} ${I18N.t('of')} ${results.length} ${I18N.t('modelCount')}`;
    }
  },

  // ──────────────────────────────────────────────
  //  Table
  // ──────────────────────────────────────────────
  _renderTable(results) {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="model-table">
          <thead>
            <tr>
              <th>${I18N.t('colModel')}</th>
              <th>${I18N.t('colParams')}</th>
              <th>${I18N.t('colBestQuant')}</th>
              <th>${I18N.t('colVram')}</th>
              <th>${I18N.t('colRam')}</th>
              <th>${I18N.t('colStatus')}</th>
            </tr>
          </thead>
          <tbody id="model-table-body">
          </tbody>
        </table>
      </div>
      <div style="padding: 10px 16px; border-top: 1px solid var(--border-color); display: flex; align-items: center;">
        <span id="model-count-display" class="model-count" style="margin-left: 0;">
          ${I18N.t('showingModels')} ${results.length} ${I18N.t('modelCount')}
        </span>
        <span style="color: var(--text-muted); font-size: 0.75rem; margin-left: 12px;">${I18N.t('expandDetail')}</span>
      </div>
    `;

    // Populate rows
    const tbody = wrapper.querySelector('#model-table-body');
    results.forEach((r, i) => {
      tbody.appendChild(this._renderRow(r, i));
    });

    // Click outside to collapse
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.model-row') && !e.target.closest('.detail-row')) {
        this._collapseAll();
      }
    });

    return wrapper;
  },

  _renderRow(result, index) {
    const { model, level, quantResults, recommendedQuant, effectiveVram, effectiveRam } = result;
    const lang = I18N.getLang();

    // Model row
    const tr = document.createElement('tr');
    tr.className = `model-row ${level}`;
    tr.setAttribute('data-index', index);

    // Best quant to display
    const bestQuant = recommendedQuant || '—';
    const bestVram = recommendedQuant ? model.sizes[recommendedQuant]?.vramGB : '—';
    const bestRam = recommendedQuant ? model.sizes[recommendedQuant]?.ramGB : '—';
    const quantLabel = recommendedQuant ? I18N.t(MATCHER.getQuantLabel(recommendedQuant)) : '—';

    tr.innerHTML = `
      <td>
        <div class="model-name">
          <span class="expand-icon">▶</span>
          ${model.name}
          ${model.strengthZH ? '<span class="zh-tag">中文</span>' : ''}
          <span class="org-tag">${model.org}</span>
        </div>
      </td>
      <td><span style="font-family: var(--font-mono);">${model.params}B</span></td>
      <td>
        <span class="quant-tag">${bestQuant}</span>
        <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 2px;">${quantLabel}</span>
      </td>
      <td style="font-family: var(--font-mono);">${typeof bestVram === 'number' ? bestVram + ' GB' : bestVram}</td>
      <td style="font-family: var(--font-mono);">${typeof bestRam === 'number' ? bestRam + ' GB' : bestRam}</td>
      <td><span class="status-badge ${level}">${I18N.t(MATCHER.getStatusText(level))}</span></td>
    `;

    // Detail row (initially hidden)
    const detailTr = document.createElement('tr');
    detailTr.className = 'detail-row';
    detailTr.setAttribute('data-index', index);
    detailTr.innerHTML = `
      <td colspan="6">
        <div class="detail-cell">
          ${this._renderDetailGrid(model, quantResults, lang)}
          <p class="detail-model-desc">${model.description?.[lang] || model.description?.en || ''}</p>
          <a class="detail-link" href="${model.url}" target="_blank" rel="noopener">
            ${I18N.t('detailOpenOllama')} ↗
          </a>
        </div>
      </td>
    `;

    // Click to toggle expand
    tr.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = detailTr.classList.contains('open');

      // Collapse all
      this._collapseAll();

      if (!isOpen) {
        detailTr.classList.add('open');
        tr.classList.add('expanded');
        tr.querySelector('.expand-icon').classList.add('open');
      }
    });

    // Wrap both rows in a fragment
    const fragment = document.createDocumentFragment();
    fragment.appendChild(tr);
    fragment.appendChild(detailTr);
    return fragment;
  },

  _renderDetailGrid(model, quantResults, lang) {
    const quantOrder = ['fp16', 'q8', 'q4', 'q3'];
    const quantNames = { fp16: 'FP16', q8: 'Q8_0', q4: 'Q4_K_M', q3: 'IQ3_M' };
    const quantDesc = {
      fp16: { zh: '全精度 · 最高质量', en: 'Full precision · Best quality' },
      q8: { zh: '8-bit · 近乎无损', en: '8-bit · Near-lossless' },
      q4: { zh: '4-bit · Ollama默认', en: '4-bit · Ollama default' },
      q3: { zh: '3-bit · 低质量应急', en: '3-bit · Emergency only' }
    };

    let html = `<div style="font-weight: 600; margin-bottom: 12px; color: var(--text-primary);">${I18N.t('detailTitle')}</div>`;
    html += '<div class="detail-grid">';

    for (const quant of quantOrder) {
      const req = model.sizes[quant];
      const qr = quantResults[quant];
      if (!req) continue;

      const fits = qr?.fit;
      html += `
        <div class="detail-quant-card ${fits ? 'fits' : 'no-fit'}">
          <div class="detail-quant-name">${quantNames[quant]}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 8px;">${quantDesc[quant]?.[lang] || quantDesc[quant]?.en || ''}</div>
          <div class="detail-quant-stats">
            <span>${I18N.t('detailVram')}: <strong>${req.vramGB} GB</strong> ${fits ? '✅' : '❌'}</span>
            <span>${I18N.t('detailRam')}: <strong>${req.ramGB} GB</strong> ${fits ? '✅' : '❌'}</span>
            <span>${I18N.t('detailDisk')}: <strong>${req.diskGB} GB</strong></span>
          </div>
        </div>
      `;
    }

    html += '</div>';
    return html;
  },

  _collapseAll() {
    document.querySelectorAll('.detail-row.open').forEach(r => r.classList.remove('open'));
    document.querySelectorAll('.model-row.expanded').forEach(r => r.classList.remove('expanded'));
    document.querySelectorAll('.expand-icon.open').forEach(r => r.classList.remove('open'));
  },

  // ──────────────────────────────────────────────
  //  Footer
  // ──────────────────────────────────────────────
  _renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container">
        <p>💡 <strong>${I18N.t('footerText')}</strong></p>
        <p>🔍 ${I18N.t('footerBrowser')}</p>
        <p style="margin-top: 12px; font-size: 0.75rem;">${I18N.t('footerDisclaimer')}</p>
      </div>
    `;
    return footer;
  }
};

// Expose globally
window.UI = UI;
