/**
 * i18n.js - 中英文双语翻译表
 * Local AI Checker - Internationalization Module
 */

const I18N = {
  _lang: null,

  strings: {
    zh: {
      // Header
      title: '本地 AI 模型兼容性检测',
      subtitle: '检测您的硬件配置，看看能运行哪些 AI 模型',
      detectBtn: '🔍 重新检测',
      langToggle: 'English',

      // Status
      detecting: '⏳ 正在检测硬件...',
      detectDone: '✅ 检测完成',
      detectWarning: '⚠️ 部分信息可能不准确',

      // Hardware Cards
      cpuTitle: '处理器 (CPU)',
      gpuTitle: '显卡 (GPU)',
      ramTitle: '内存 (RAM)',
      diskTitle: '磁盘空间',
      osTitle: '操作系统',
      cores: '核心',
      logicalCores: '逻辑核心',
      vramLabel: '显存',
      unknown: '未知',
      integrated: '集成显卡',
      sharedMemory: '共享内存',
      browserQuota: '浏览器可用空间',
      notRealDisk: '非真实磁盘空间',
      detectionSource: '检测来源',
      confidence: '可信度',
      confidenceHigh: '高',
      confidenceMedium: '中',
      confidenceLow: '低',

      // Model Table
      modelTable: '模型兼容性列表',
      searchPlaceholder: '搜索模型名称...',
      filterAll: '全部',
      filterRuns: '✅ 可流畅运行',
      filterLimited: '⚠️ 勉强可运行',
      filterCannot: '❌ 无法运行',
      filterUnknown: '⬜ 无法判断',
      categoryAll: '全部分类',
      categoryChat: '💬 对话',
      categoryCoding: '💻 编程',
      categoryReasoning: '🧠 推理',
      categoryVision: '👁 视觉',
      categoryEmbedding: '📊 嵌入',
      sizeAll: '全部大小',
      sizeUltraLight: '超轻量 (<3B)',
      sizeLight: '轻量 (7-9B)',
      sizeMid: '中等 (12-16B)',
      sizeHeavy: '重型 (27-35B)',
      sizeUltra: '超大 (70B+)',
      sortDefault: '默认排序',
      sortName: '名称排序',
      sortParams: '参数规模',
      sortCompat: '兼容性排序',

      // Table Headers
      colModel: '模型',
      colParams: '参数量',
      colBestQuant: '推荐量化',
      colVram: '需要显存',
      colRam: '需要内存',
      colDisk: '磁盘占用',
      colStatus: '状态',

      // Status Labels
      statusRuns: '可流畅运行',
      statusLimited: '勉强可运行',
      statusCannot: '无法运行',
      statusUnknown: '无法判断',

      // Quantization
      quantFp16: 'FP16 (最高质量)',
      quantQ8: 'Q8 (近乎无损)',
      quantQ4: 'Q4_K_M (推荐)',
      quantQ3: 'Q3 (低质量)',
      quantNone: '—',

      // Detail Panel
      detailTitle: '量化级别详情',
      detailQuant: '量化',
      detailVram: '显存需求',
      detailRam: '内存需求',
      detailDisk: '磁盘占用',
      detailFit: '是否适配',
      detailYes: '✅ 是',
      detailNo: '❌ 否',
      detailOpenOllama: '📦 在 Ollama 中查看',
      detailNote: '说明',

      // Footer
      footerText: '💡 提示：内存需求包含模型加载和系统运行开销。实际表现可能因硬件驱动、后台程序等因素略有差异。',
      footerBrowser: '浏览器检测存在限制，显存数据来自 GPU 数据库匹配，仅供参考。',
      footerDisclaimer: '本工具仅检测浏览器可获取的硬件信息，推荐结果基于理论计算。',

      // Warnings
      warnPrivacy: '您的浏览器启用了隐私保护，部分硬件信息无法获取。',
      warnLowConfidence: '硬件检测可信度较低，推荐结果仅供参考。',
      warnIntegrated: '检测到集成显卡，将使用系统内存作为共享显存。',
      warnMobile: '检测到移动设备，本地部署 AI 模型通常需要桌面级硬件。',

      // Model descriptions
      modelCount: '个模型',
      showingModels: '显示',
      of: '/',
      expandDetail: '点击展开量化详情',

      // Misc
      ollamaTag: 'Ollama',
      paramsUnit: 'B',
      diskUnit: 'GB',
      loading: '加载中...',
    },

    en: {
      // Header
      title: 'Local AI Model Compatibility Check',
      subtitle: 'Detect your hardware and see which AI models you can run locally',
      detectBtn: '🔍 Re-detect',
      langToggle: '中文',

      // Status
      detecting: '⏳ Detecting hardware...',
      detectDone: '✅ Detection complete',
      detectWarning: '⚠️ Some info may be inaccurate',

      // Hardware Cards
      cpuTitle: 'Processor (CPU)',
      gpuTitle: 'Graphics (GPU)',
      ramTitle: 'Memory (RAM)',
      diskTitle: 'Disk Space',
      osTitle: 'Operating System',
      cores: 'Cores',
      logicalCores: 'Logical Cores',
      vramLabel: 'VRAM',
      unknown: 'Unknown',
      integrated: 'Integrated GPU',
      sharedMemory: 'Shared Memory',
      browserQuota: 'Browser Quota',
      notRealDisk: 'Not actual disk space',
      detectionSource: 'Source',
      confidence: 'Confidence',
      confidenceHigh: 'High',
      confidenceMedium: 'Medium',
      confidenceLow: 'Low',

      // Model Table
      modelTable: 'Model Compatibility',
      searchPlaceholder: 'Search models...',
      filterAll: 'All',
      filterRuns: '✅ Runs Well',
      filterLimited: '⚠️ Limited',
      filterCannot: '❌ Cannot Run',
      filterUnknown: '⬜ Unknown',
      categoryAll: 'All Categories',
      categoryChat: '💬 Chat',
      categoryCoding: '💻 Coding',
      categoryReasoning: '🧠 Reasoning',
      categoryVision: '👁 Vision',
      categoryEmbedding: '📊 Embedding',
      sizeAll: 'All Sizes',
      sizeUltraLight: 'Ultra Light (<3B)',
      sizeLight: 'Light (7-9B)',
      sizeMid: 'Mid (12-16B)',
      sizeHeavy: 'Heavy (27-35B)',
      sizeUltra: 'Ultra (70B+)',
      sortDefault: 'Default',
      sortName: 'By Name',
      sortParams: 'By Parameters',
      sortCompat: 'By Compatibility',

      // Table Headers
      colModel: 'Model',
      colParams: 'Params',
      colBestQuant: 'Best Quant',
      colVram: 'VRAM Needed',
      colRam: 'RAM Needed',
      colDisk: 'Disk',
      colStatus: 'Status',

      // Status Labels
      statusRuns: 'Runs Well',
      statusLimited: 'Limited',
      statusCannot: 'Cannot Run',
      statusUnknown: 'Unknown',

      // Quantization
      quantFp16: 'FP16 (Best Quality)',
      quantQ8: 'Q8 (Near-lossless)',
      quantQ4: 'Q4_K_M (Recommended)',
      quantQ3: 'Q3 (Low Quality)',
      quantNone: '—',

      // Detail Panel
      detailTitle: 'Quantization Details',
      detailQuant: 'Quant',
      detailVram: 'VRAM',
      detailRam: 'RAM',
      detailDisk: 'Disk',
      detailFit: 'Fits',
      detailYes: '✅ Yes',
      detailNo: '❌ No',
      detailOpenOllama: '📦 View on Ollama',
      detailNote: 'Note',

      // Footer
      footerText: '💡 Note: Memory requirements include model loading and OS overhead. Actual performance may vary based on drivers and background processes.',
      footerBrowser: 'Browser detection is limited. VRAM data comes from GPU database lookup and serves as an estimate.',
      footerDisclaimer: 'This tool only detects hardware info available to the browser. Recommendations are based on theoretical calculations.',

      // Warnings
      warnPrivacy: 'Privacy protection is enabled in your browser. Some hardware info may be unavailable.',
      warnLowConfidence: 'Hardware detection confidence is low. Recommendations are estimates.',
      warnIntegrated: 'Integrated GPU detected. System RAM will be used as shared video memory.',
      warnMobile: 'Mobile device detected. Local AI model deployment typically requires desktop-grade hardware.',

      // Model descriptions
      modelCount: 'models',
      showingModels: 'Showing',
      of: 'of',
      expandDetail: 'Click to expand quantization details',

      // Misc
      ollamaTag: 'Ollama',
      paramsUnit: 'B',
      diskUnit: 'GB',
      loading: 'Loading...',
    }
  },

  init() {
    // Detect browser language, default to Chinese if zh-*
    const browserLang = (navigator.language || 'zh-CN').toLowerCase();
    this._lang = browserLang.startsWith('zh') ? 'zh' : 'en';
    // Check localStorage override
    const saved = localStorage.getItem('ai-checker-lang');
    if (saved === 'zh' || saved === 'en') {
      this._lang = saved;
    }
  },

  t(key) {
    return this.strings[this._lang]?.[key] || this.strings.en?.[key] || key;
  },

  getLang() {
    return this._lang;
  },

  setLang(lang) {
    if (lang === 'zh' || lang === 'en') {
      this._lang = lang;
      localStorage.setItem('ai-checker-lang', lang);
    }
  },

  toggleLang() {
    this.setLang(this._lang === 'zh' ? 'en' : 'zh');
  }
};

// Expose globally
window.I18N = I18N;
