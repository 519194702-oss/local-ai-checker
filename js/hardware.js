/**
 * hardware.js - 硬件检测模块 (CPU, GPU, VRAM, RAM, Disk, OS)
 * Local AI Checker - Hardware Detection Module
 *
 * Strategy (in priority order):
 *   CPU  → navigator.hardwareConcurrency + UA parsing
 *   GPU  → WebGL WEBGL_debug_renderer_info → WebGPU adapter → heuristic
 *   VRAM → GPU name → GPUDB lookup
 *   RAM  → navigator.deviceMemory → CPU-core heuristic → default 8GB
 *   Disk → navigator.storage.estimate()
 *   OS   → navigator.userAgent parsing + userAgentData
 */

const HARDWARE = {

  // ──────────────────────────────────────────────
  //  CPU Detection
  // ──────────────────────────────────────────────
  detectCPU() {
    const cores = navigator.hardwareConcurrency;
    const ua = navigator.userAgent;

    // Parse platform
    let platform = 'Unknown';
    let platformVersion = '';
    if (/Windows NT 10/.test(ua) || /Windows NT 11/.test(ua)) {
      platform = 'Windows';
      platformVersion = /Windows NT ([\d.]+)/.exec(ua)?.[1] || '';
    } else if (/Windows NT 6/.test(ua)) {
      platform = 'Windows';
      platformVersion = '7/8';
    } else if (/Mac OS X/.test(ua)) {
      platform = 'macOS';
      platformVersion = /Mac OS X ([_\d]+)/.exec(ua)?.[1]?.replace(/_/g, '.') || '';
    } else if (/Linux/.test(ua) && !/Android/.test(ua)) {
      platform = 'Linux';
    } else if (/CrOS/.test(ua)) {
      platform = 'ChromeOS';
    } else if (/Android/.test(ua)) {
      platform = 'Android';
    } else if (/iPhone|iPad|iPod/.test(ua)) {
      platform = 'iOS';
    }

    // Parse architecture
    let arch = 'Unknown';
    if (/x86_64|WOW64|Win64|x64|amd64/i.test(ua)) {
      arch = 'x86_64';
    } else if (/i[3456]86|x86/i.test(ua)) {
      arch = 'x86';
    } else if (/aarch64|arm64|ARM64/i.test(ua)) {
      arch = 'ARM64';
    } else if (/armv[78]/i.test(ua)) {
      arch = 'ARM32';
    }

    // Use userAgentData for more accurate info (Chromium)
    if (navigator.userAgentData) {
      try {
        // platform is available synchronously in modern Chrome
        if (navigator.userAgentData.platform) {
          const uaPlatform = navigator.userAgentData.platform;
          if (/Windows/i.test(uaPlatform)) platform = 'Windows';
          else if (/macOS/i.test(uaPlatform)) platform = 'macOS';
          else if (/Linux/i.test(uaPlatform)) platform = 'Linux';
          else if (/ChromeOS/i.test(uaPlatform)) platform = 'ChromeOS';
        }
      } catch (e) { /* ignore */ }
    }

    // Determine tier
    let tier = 'entry-level';
    if (cores >= 32) tier = 'workstation';
    else if (cores >= 16) tier = 'high-end';
    else if (cores >= 8) tier = 'mid-range';
    else if (cores >= 4) tier = 'entry-level';

    return {
      cores: cores || 4,
      coresAccurate: !!cores,
      platform,
      platformVersion,
      arch,
      tier,
      source: cores ? 'hardwareConcurrency' : 'fallback'
    };
  },

  // ──────────────────────────────────────────────
  //  GPU Detection
  // ──────────────────────────────────────────────
  async detectGPU() {
    let gpu = null;

    // Method 1: WebGL (works on all browsers)
    gpu = this._detectGPUWebGL();
    if (gpu && gpu.name && gpu.name !== 'Unknown') {
      return gpu;
    }

    // Method 2: WebGPU (Chrome 113+, Edge 113+)
    gpu = await this._detectGPUWebGPU();
    if (gpu && gpu.name && gpu.name !== 'Unknown') {
      return gpu;
    }

    // Method 3: Complete fallback
    return this._gpuFallback();
  },

  _detectGPUWebGL() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return null;

      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (!ext) {
        // Privacy protection enabled (Firefox resistFingerprinting)
        return {
          name: 'Unknown (privacy mode)',
          vendor: 'Unknown',
          vram: 0,
          type: 'unknown',
          tier: 'unknown',
          confidence: 'fallback',
          source: 'webgl-blocked',
          privacyBlocked: true
        };
      }

      const rawRenderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      const rawVendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);

      // Lookup GPU database
      const gpuInfo = GPUDB.lookup(rawRenderer);

      return {
        name: gpuInfo.raw || GPUDB.normalizeRenderer(rawRenderer),
        vendor: rawVendor || 'Unknown',
        vram: gpuInfo.vram || 0,
        type: gpuInfo.type || 'unknown',
        tier: gpuInfo.tier || 'unknown',
        unified: gpuInfo.unified || false,
        shared: gpuInfo.shared || false,
        confidence: gpuInfo.confidence || 'fallback',
        source: 'webgl',
        rawRenderer: rawRenderer
      };
    } catch (e) {
      return null;
    }
  },

  async _detectGPUWebGPU() {
    if (!navigator.gpu) return null;
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) return null;

      const info = adapter.info;
      const rawName = info.description || 'Unknown';
      const gpuInfo = GPUDB.lookup(rawName);

      return {
        name: gpuInfo.raw || rawName,
        vendor: info.vendor || 'Unknown',
        vram: gpuInfo.vram || 0,
        type: gpuInfo.type || 'unknown',
        tier: gpuInfo.tier || 'unknown',
        unified: gpuInfo.unified || false,
        shared: gpuInfo.shared || false,
        confidence: gpuInfo.confidence || 'fallback',
        source: 'webgpu',
        rawRenderer: rawName
      };
    } catch (e) {
      return null;
    }
  },

  _gpuFallback() {
    return {
      name: 'Unknown GPU',
      vendor: 'Unknown',
      vram: 0,
      type: 'unknown',
      tier: 'unknown',
      unified: false,
      shared: true,
      confidence: 'fallback',
      source: 'fallback'
    };
  },

  // ──────────────────────────────────────────────
  //  RAM Detection
  // ──────────────────────────────────────────────
  detectRAM() {
    let detected = null;
    let source = 'fallback';
    let confidence = 'low';

    // Chrome/Edge: navigator.deviceMemory (0.25, 0.5, 1, 2, 4, 8, 16, 32)
    if ('deviceMemory' in navigator) {
      detected = navigator.deviceMemory;
      source = 'deviceMemory';
      confidence = detected >= 0.5 ? 'medium' : 'low';
    }

    // Estimate from CPU cores if needed
    let estimated = detected;
    if (estimated === null || estimated === undefined) {
      const cores = navigator.hardwareConcurrency || 4;
      if (cores >= 32) estimated = 64;
      else if (cores >= 24) estimated = 32;
      else if (cores >= 16) estimated = 32;
      else if (cores >= 12) estimated = 16;
      else if (cores >= 8) estimated = 16;
      else if (cores >= 6) estimated = 8;
      else if (cores >= 4) estimated = 8;
      else estimated = 4;
      source = 'heuristic';
      confidence = 'low';
    }

    // Effective RAM = total - OS overhead
    const platform = this._getPlatform();
    let osOverhead;
    if (platform === 'Windows') osOverhead = 3;
    else if (platform === 'macOS') osOverhead = 2.5;
    else if (platform === 'Linux') osOverhead = 1.5;
    else osOverhead = 2;

    return {
      total: detected,
      estimated: estimated,
      effective: Math.max(2, (detected || estimated) - osOverhead),
      source,
      confidence,
      accurate: !!detected
    };
  },

  // ──────────────────────────────────────────────
  //  Disk Detection (browser storage quota only)
  // ──────────────────────────────────────────────
  async detectDisk() {
    try {
      if ('storage' in navigator && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const quotaGB = Math.round((estimate.quota || 0) / (1024 ** 3) * 10) / 10;
        const usageGB = Math.round((estimate.usage || 0) / (1024 ** 3) * 10) / 10;
        return {
          quotaGB,
          usageGB,
          availableGB: Math.round((quotaGB - usageGB) * 10) / 10,
          source: 'storage.estimate',
          note: 'browser_quota_only'
        };
      }
    } catch (e) { /* ignore */ }
    return { quotaGB: null, source: 'unavailable', note: 'browser_quota_only' };
  },

  // ──────────────────────────────────────────────
  //  OS Detection
  // ──────────────────────────────────────────────
  detectOS() {
    const ua = navigator.userAgent;

    let os = 'Unknown';
    let version = '';

    // Windows
    if (/Windows NT 10.0/i.test(ua)) {
      // Windows 10 vs 11 heuristic: Win11 builds are >= 22000
      os = 'Windows 10/11';
      version = 'NT 10.0';
    } else if (/Windows NT 6.3/i.test(ua)) { os = 'Windows 8.1'; version = '8.1'; }
    else if (/Windows NT 6.2/i.test(ua)) { os = 'Windows 8'; version = '8'; }
    else if (/Windows NT 6.1/i.test(ua)) { os = 'Windows 7'; version = '7'; }
    // macOS
    else if (/Mac OS X/i.test(ua)) {
      os = 'macOS';
      const v = /Mac OS X ([_\d]+)/i.exec(ua);
      version = v ? v[1].replace(/_/g, '.') : '';
    }
    // Linux
    else if (/Linux/i.test(ua) && !/Android/i.test(ua)) { os = 'Linux'; }
    // ChromeOS
    else if (/CrOS/i.test(ua)) { os = 'ChromeOS'; }
    // Android
    else if (/Android/i.test(ua)) {
      os = 'Android';
      const v = /Android\s+([\d.]+)/i.exec(ua);
      version = v ? v[1] : '';
    }
    // iOS
    else if (/iPhone|iPad|iPod/i.test(ua)) { os = 'iOS'; }

    // 64-bit check
    const is64Bit = /x86_64|WOW64|Win64|amd64|aarch64|arm64/i.test(ua);

    return {
      name: os,
      version,
      is64Bit,
      source: 'userAgent'
    };
  },

  // ──────────────────────────────────────────────
  //  Helper
  // ──────────────────────────────────────────────
  _getPlatform() {
    const ua = navigator.userAgent;
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac OS X/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'Linux';
    if (/Android/i.test(ua)) return 'Android';
    return 'Unknown';
  },

  // ──────────────────────────────────────────────
  //  Check for warnings
  // ──────────────────────────────────────────────
  getWarnings(hardware) {
    const warnings = [];

    if (hardware.gpu.privacyBlocked) {
      warnings.push('warnPrivacy');
    }
    if (hardware.gpu.confidence === 'fallback' || hardware.gpu.confidence === 'heuristic') {
      warnings.push('warnLowConfidence');
    }
    if (hardware.gpu.shared && !hardware.gpu.unified) {
      warnings.push('warnIntegrated');
    }
    if (hardware.ram.confidence === 'low') {
      warnings.push('warnLowConfidence');
    }
    // Check if mobile
    const ua = navigator.userAgent;
    if (/Android|iPhone|iPad|iPod/i.test(ua) && !/Windows|Mac OS X|Linux/i.test(ua)) {
      warnings.push('warnMobile');
    }

    return [...new Set(warnings)]; // deduplicate
  },

  // ──────────────────────────────────────────────
  //  Main detection entry
  // ──────────────────────────────────────────────
  async detectAll() {
    // Run CPU, RAM, OS synchronously
    const cpu = this.detectCPU();
    const ram = this.detectRAM();
    const os = this.detectOS();

    // Run GPU and Disk in parallel (both async)
    const [gpu, disk] = await Promise.all([
      this.detectGPU(),
      this.detectDisk()
    ]);

    const hardware = { cpu, gpu, ram, disk, os };

    // Compute effective VRAM for matching
    // Apple Silicon: unified memory = 75% of effective RAM
    // Discrete GPU: use dedicated VRAM
    // Integrated: 40% of effective RAM (shared, bandwidth-limited)
    if (gpu.unified) {
      hardware.effectiveVram = ram.effective * 0.75;
    } else if (gpu.vram > 0) {
      hardware.effectiveVram = gpu.vram;
    } else {
      hardware.effectiveVram = ram.effective * 0.4;
    }

    // Effective RAM for model loading
    hardware.effectiveRam = ram.effective;

    // Warnings
    hardware.warnings = this.getWarnings(hardware);

    return hardware;
  }
};

// Expose globally
window.HARDWARE = HARDWARE;
