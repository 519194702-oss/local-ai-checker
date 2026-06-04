/**
 * matcher.js - 兼容性匹配算法
 * Local AI Checker - Compatibility Matching Engine
 *
 * Determines which quantization levels each model can run at
 * given the user's detected hardware. Returns color-coded results.
 */

const MATCHER = {

  /**
   * Match a single model against hardware.
   * Returns { level, recommendedQuant, quantResults, details }
   */
  matchModel(hardware, model) {
    const effectiveVram = hardware.effectiveVram;
    const effectiveRam = hardware.effectiveRam;

    const quantResults = {};
    let bestQuant = null;

    // Try each quantization from highest quality to lowest
    const quantOrder = ['fp16', 'q8', 'q4', 'q3'];
    for (const quant of quantOrder) {
      const req = model.sizes[quant];
      if (!req) continue;

      const vramOk = effectiveVram >= req.vramGB;
      const ramOk = effectiveRam >= req.ramGB;
      const diskOk = true; // Disk is browser quota, not real disk — always pass

      quantResults[quant] = {
        vramOk,
        ramOk,
        diskOk,
        fit: vramOk && ramOk,
        requiredVram: req.vramGB,
        requiredRam: req.ramGB,
        requiredDisk: req.diskGB,
        vramMargin: Math.round((effectiveVram - req.vramGB) * 10) / 10,
        ramMargin: Math.round((effectiveRam - req.ramGB) * 10) / 10
      };

      if (vramOk && ramOk && !bestQuant) {
        bestQuant = quant;
      }
    }

    // Determine overall level and label
    let level, label, recommendedQuant;

    if (quantResults.fp16?.fit) {
      level = 'green';
      label = 'fp16';
      recommendedQuant = 'fp16';
    } else if (quantResults.q8?.fit) {
      level = 'green';
      label = 'q8';
      recommendedQuant = 'q8';
    } else if (quantResults.q4?.fit) {
      level = 'green';
      label = 'q4';
      recommendedQuant = 'q4';
    } else if (quantResults.q3?.fit) {
      level = 'yellow';
      label = 'q3_only';
      recommendedQuant = 'q3';
    } else if (quantResults.q4) {
      // Check if borderline: within 20% of Q4 VRAM/RAM requirements
      const vramRatio = effectiveVram / quantResults.q4.requiredVram;
      const ramRatio = effectiveRam / quantResults.q4.requiredRam;
      if (vramRatio >= 0.7 && ramRatio >= 0.7) {
        level = 'yellow';
        label = 'borderline';
        recommendedQuant = null;
      } else {
        level = 'red';
        label = 'insufficient';
        recommendedQuant = null;
      }
    } else {
      level = 'gray';
      label = 'unknown';
      recommendedQuant = null;
    }

    // Special case: can't determine hardware
    if (effectiveVram <= 0 && effectiveRam <= 0) {
      level = 'gray';
      label = 'no_hardware_data';
    }

    return {
      model,
      level,
      label,
      recommendedQuant,
      quantResults,
      effectiveVram,
      effectiveRam
    };
  },

  /**
   * Match all models against hardware.
   * Returns sorted array of match results.
   */
  matchAll(hardware, models) {
    const results = models.map(model => this.matchModel(hardware, model));

    // Sort: green → yellow → red → gray, then by parameter count
    const levelOrder = { green: 0, yellow: 1, red: 2, gray: 3 };
    results.sort((a, b) => {
      const lvlDiff = levelOrder[a.level] - levelOrder[b.level];
      if (lvlDiff !== 0) return lvlDiff;
      return a.model.params - b.model.params;
    });

    return results;
  },

  /**
   * Get counts by status level
   */
  getStats(results) {
    return {
      total: results.length,
      green: results.filter(r => r.level === 'green').length,
      yellow: results.filter(r => r.level === 'yellow').length,
      red: results.filter(r => r.level === 'red').length,
      gray: results.filter(r => r.level === 'gray').length,
    };
  },

  /**
   * Get status text
   */
  getStatusText(level) {
    switch (level) {
      case 'green': return 'statusRuns';
      case 'yellow': return 'statusLimited';
      case 'red': return 'statusCannot';
      default: return 'statusUnknown';
    }
  },

  /**
   * Get recommended quant display text
   */
  getQuantLabel(quant) {
    switch (quant) {
      case 'fp16': return 'quantFp16';
      case 'q8': return 'quantQ8';
      case 'q4': return 'quantQ4';
      case 'q3': return 'quantQ3';
      default: return 'quantNone';
    }
  }
};

// Expose globally
window.MATCHER = MATCHER;
