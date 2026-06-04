/**
 * app.js - 应用启动入口
 * Local AI Checker - Application Bootstrap
 *
 * Orchestrates: hardware detection → model matching → UI rendering
 */

const App = {

  async init() {
    // Initialize modules
    I18N.init();
    UI.init();

    // Show skeleton UI immediately
    UI.renderSkeleton();

    try {
      // Detect hardware
      const hardware = await HARDWARE.detectAll();

      // Match all models
      const results = MATCHER.matchAll(hardware, MODELS_DATABASE);

      // Render full UI
      UI.renderAll(hardware, results);

      console.log('[AI Checker] Detection complete', {
        cpu: hardware.cpu,
        gpu: hardware.gpu,
        ram: hardware.ram,
        effectiveVram: Math.round(hardware.effectiveVram * 10) / 10 + ' GB',
        effectiveRam: Math.round(hardware.effectiveRam * 10) / 10 + ' GB',
        modelStats: MATCHER.getStats(results)
      });
    } catch (err) {
      console.error('[AI Checker] Error:', err);
      UI.showError(err.message || 'Detection failed. Please try again.');
    }
  }
};

// Start on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
