/*
 * enhancements.js - UX improvements for Local AI Checker
 * Loaded after ui.js and before app.js.
 */
(function () {
  const state = {
    detectedHardware: null,
    currentHardware: null,
    lastResults: null,
    manualMode: false
  };

  function lang() {
    return I18N.getLang && I18N.getLang() === 'en' ? 'en' : 'zh';
  }

  function text(zh, en) {
    return lang() === 'en' ? en : zh;
  }

  function formatGB(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    return `${Math.round(Number(value) * 10) / 10} GB`;
  }

  function getOllamaTag(model) {
    if (model.url && model.url.includes('/library/')) {
      return model.url.split('/library/')[1].replace(/\/$/, '');
    }
    return model.id || model.name.toLowerCase().replace(/\s+/g, '-');
  }

  function getRunnable(results) {
    return results.filter(r => r.level === 'green' || r.level === 'yellow');
  }

  function createSummary(hardware, results) {
    const stats = MATCHER.getStats(results);
    const runnable = getRunnable(results);
    const top = runnable.slice(0, 4);
    const bestChinese = runnable.find(r => r.model.strengthZH);
    const bestCoding = runnable.find(r => r.model.tags.includes('coding'));
    const bestLight = runnable.find(r => r.model.params <= 3.5);

    const section = document.createElement('section');
    section.className = 'container fade-in';
    section.innerHTML = `
      <div class="summary-panel">
        <div class="summary-main">
          <div class="summary-kicker">${text('检测结论', 'Result')}</div>
          <h2>${runnable.length
            ? text(`这台设备推荐优先跑 ${top[0].model.name}`, `Recommended first: ${top[0].model.name}`)
            : text('当前配置不建议直接本地运行主流大模型', 'This device is not recommended for mainstream local LLMs')}</h2>
          <p>${text(
            `可运行 ${runnable.length} 个模型，其中 ${stats.green} 个较稳，${stats.yellow} 个偏勉强。有效显存约 ${formatGB(hardware.effectiveVram)}，有效内存约 ${formatGB(hardware.effectiveRam)}。`,
            `${runnable.length} models are runnable: ${stats.green} stable and ${stats.yellow} limited. Effective VRAM is about ${formatGB(hardware.effectiveVram)}, effective RAM about ${formatGB(hardware.effectiveRam)}.`
          )}</p>
        </div>
        <div class="summary-stats">
          <span class="pill good">✅ ${stats.green}</span>
          <span class="pill warn">⚠️ ${stats.yellow}</span>
          <span class="pill bad">❌ ${stats.red}</span>
          <span class="pill gray">⬜ ${stats.gray}</span>
        </div>
        <div class="recommend-grid">
          ${top.map(r => `
            <button class="recommend-card" data-model-id="${r.model.id}">
              <span class="recommend-name">${r.model.name}</span>
              <span class="recommend-meta">${r.recommendedQuant ? r.recommendedQuant.toUpperCase() : '—'} · ${r.model.params}B · ${I18N.t(MATCHER.getStatusText(r.level))}</span>
              <code>ollama run ${getOllamaTag(r.model)}</code>
            </button>
          `).join('') || `<div class="empty-tip">${text('建议升级内存/显卡，或尝试云端模型。', 'Upgrade RAM/GPU or use cloud models.')}</div>`}
        </div>
        <div class="use-case-row">
          <span>💬 ${text('中文优先', 'Chinese')}: <strong>${bestChinese?.model.name || '—'}</strong></span>
          <span>💻 ${text('编程优先', 'Coding')}: <strong>${bestCoding?.model.name || '—'}</strong></span>
          <span>🚀 ${text('低配优先', 'Low spec')}: <strong>${bestLight?.model.name || '—'}</strong></span>
        </div>
      </div>
    `;

    section.querySelectorAll('.recommend-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-model-id');
        const input = document.getElementById('search-input');
        if (input) {
          input.value = id;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          document.querySelector('.table-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    return section;
  }

  function createManualPanel(hardware) {
    const section = document.createElement('section');
    section.className = 'container fade-in';
    section.innerHTML = `
      <div class="manual-panel">
        <div>
          <h3>${text('手动校准配置', 'Manual calibration')}</h3>
          <p>${text('浏览器拿不到完整硬件信息时，可以手动填真实内存/显存，结果会更接近实际。', 'When browser detection is limited, enter real RAM/VRAM for more accurate matching.')}</p>
        </div>
        <label>${text('有效内存', 'Effective RAM')}
          <input id="manual-ram" type="number" min="2" max="512" step="1" value="${Math.round(hardware.effectiveRam || 8)}">
        </label>
        <label>${text('有效显存', 'Effective VRAM')}
          <input id="manual-vram" type="number" min="0" max="192" step="1" value="${Math.round(hardware.effectiveVram || 0)}">
        </label>
        <div class="manual-actions">
          <button class="btn btn-primary" id="apply-manual">${text('应用校准', 'Apply')}</button>
          <button class="btn" id="reset-manual">${text('恢复检测值', 'Reset')}</button>
        </div>
      </div>
    `;

    section.querySelector('#apply-manual').addEventListener('click', () => {
      const ram = Number(section.querySelector('#manual-ram').value);
      const vram = Number(section.querySelector('#manual-vram').value);
      const base = state.currentHardware || hardware;
      const adjusted = JSON.parse(JSON.stringify(base));
      adjusted.effectiveRam = Math.max(2, ram || base.effectiveRam || 8);
      adjusted.effectiveVram = Math.max(0, vram || 0);
      adjusted.ram.estimated = adjusted.effectiveRam;
      adjusted.ram.source = 'manual';
      adjusted.ram.confidence = 'medium';
      adjusted.gpu.name = `${adjusted.gpu.name || 'GPU'} (${text('手动校准', 'manual')})`;
      adjusted.gpu.vram = adjusted.effectiveVram;
      adjusted.gpu.source = 'manual';
      state.manualMode = true;
      UI.renderAll(adjusted, MATCHER.matchAll(adjusted, MODELS_DATABASE));
    });

    section.querySelector('#reset-manual').addEventListener('click', () => {
      if (state.detectedHardware) {
        state.manualMode = false;
        UI.renderAll(state.detectedHardware, MATCHER.matchAll(state.detectedHardware, MODELS_DATABASE));
      }
    });

    return section;
  }

  function exportReport() {
    if (!state.currentHardware || !state.lastResults) return;
    const h = state.currentHardware;
    const runnable = getRunnable(state.lastResults).slice(0, 12);
    const lines = [
      `# ${text('本地 AI 检测报告', 'Local AI Checker Report')}`,
      '',
      `- CPU: ${h.cpu.cores} ${text('逻辑核心', 'logical cores')}`,
      `- GPU: ${h.gpu.name || 'Unknown'} / ${formatGB(h.effectiveVram)}`,
      `- RAM: ${formatGB(h.effectiveRam)}`,
      `- OS: ${h.os.name}`,
      '',
      `## ${text('推荐模型', 'Recommended models')}`,
      ...runnable.map(r => `- ${r.model.name} (${r.recommendedQuant || '—'}): ollama run ${getOllamaTag(r.model)}`)
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'local-ai-checker-report.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  function addActionButtons(header) {
    const right = header.querySelector('.header-right');
    if (!right || right.querySelector('#btn-export-report')) return;
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.id = 'btn-export-report';
    btn.textContent = text('⬇️ 导出报告', '⬇️ Export');
    btn.addEventListener('click', exportReport);
    right.insertBefore(btn, right.firstChild);
  }

  const originalRenderAll = UI.renderAll.bind(UI);
  UI.renderAll = function (hardware, results) {
    if (!state.detectedHardware || !state.manualMode) {
      state.detectedHardware = JSON.parse(JSON.stringify(hardware));
    }
    state.currentHardware = hardware;
    state.lastResults = results;

    this._app.innerHTML = '';
    const header = this._renderHeader();
    addActionButtons(header);
    this._app.appendChild(header);
    this._app.appendChild(this._renderStatus(hardware));
    this._app.appendChild(this._renderWarning(hardware));
    this._app.appendChild(createSummary(hardware, results));
    this._app.appendChild(this._renderCards(hardware));
    this._app.appendChild(createManualPanel(hardware));
    this._app.appendChild(this._renderModelSection(results));
    this._app.appendChild(this._renderFooter());
  };

  const originalDetailGrid = UI._renderDetailGrid.bind(UI);
  UI._renderDetailGrid = function (model, quantResults, currentLang) {
    const base = originalDetailGrid(model, quantResults, currentLang);
    const command = `ollama run ${getOllamaTag(model)}`;
    const copyText = text('复制运行命令', 'Copy run command');
    const copiedText = text('已复制', 'Copied');
    setTimeout(() => {
      document.querySelectorAll(`[data-copy-command="${CSS.escape(command)}"]`).forEach(btn => {
        if (btn.dataset.bound) return;
        btn.dataset.bound = '1';
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          try {
            await navigator.clipboard.writeText(command);
            btn.textContent = `✅ ${copiedText}`;
            setTimeout(() => { btn.textContent = `📋 ${copyText}`; }, 1400);
          } catch (_) {
            window.prompt(text('复制这条命令：', 'Copy this command:'), command);
          }
        });
      });
    }, 0);
    return `${base}
      <div class="command-box">
        <div>
          <span>${text('推荐运行命令', 'Recommended command')}</span>
          <code>${command}</code>
        </div>
        <button class="btn btn-sm" data-copy-command="${command}">📋 ${copyText}</button>
      </div>`;
  };

  window.AI_CHECKER_ENHANCEMENTS = state;
})();
