/**
 * gpu-db.js - GPU 型号 → VRAM 数据库 + 匹配查找
 * Local AI Checker - GPU Database Module
 *
 * Covers:
 * - NVIDIA: GTX 900 → RTX 5000 (desktop + laptop)
 * - AMD: RX 400 → RX 9000
 * - Intel Arc: Alchemist / Battlemage
 * - Apple Silicon: M1/M2/M3/M4
 * - Integrated: Intel UHD/Iris, AMD APU
 */

const GPU_DATABASE = {

  // ==================== NVIDIA Desktop ====================

  // RTX 50 Series (Blackwell)
  "NVIDIA GeForce RTX 5090":                { vram: 32, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA GeForce RTX 5080":                { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 5070 Ti":             { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 5070":                { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 5060 Ti":             { vram: 16, type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 5060":                { vram: 12, type: 'discrete', tier: 'mid' },

  // RTX 40 Series (Ada Lovelace)
  "NVIDIA GeForce RTX 4090":                { vram: 24, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA GeForce RTX 4080 SUPER":          { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 4080":                { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 4070 Ti SUPER":       { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 4070 Ti":             { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 4070 SUPER":          { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 4070":                { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 4060 Ti 16GB":        { vram: 16, type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 4060 Ti":             { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 4060":                { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 4050":                { vram: 6,  type: 'discrete', tier: 'entry' },

  // RTX 30 Series (Ampere)
  "NVIDIA GeForce RTX 3090 Ti":             { vram: 24, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA GeForce RTX 3090":                { vram: 24, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA GeForce RTX 3080 Ti":             { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 3080 12GB":           { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 3080":                { vram: 10, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 3070 Ti":             { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 3070":                { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 3060 Ti":             { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 3060":                { vram: 12, type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 3050":                { vram: 8,  type: 'discrete', tier: 'entry' },

  // RTX 20 Series (Turing)
  "NVIDIA GeForce RTX 2080 Ti":             { vram: 11, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 2080 SUPER":          { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 2080":                { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 2070 SUPER":          { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 2070":                { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 2060 SUPER":          { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 2060 12GB":           { vram: 12, type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 2060":                { vram: 6,  type: 'discrete', tier: 'entry' },

  // GTX 16 Series (Turing, no RT)
  "NVIDIA GeForce GTX 1660 Ti":             { vram: 6, type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1660 SUPER":          { vram: 6, type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1660":                { vram: 6, type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1650 SUPER":          { vram: 4, type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1650 Ti":             { vram: 4, type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1650":                { vram: 4, type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1630":                { vram: 4, type: 'discrete', tier: 'entry' },

  // GTX 10 Series (Pascal)
  "NVIDIA GeForce GTX 1080 Ti":             { vram: 11, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce GTX 1080":                { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce GTX 1070 Ti":             { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce GTX 1070":                { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce GTX 1060 6GB":            { vram: 6,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1060 3GB":            { vram: 3,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1050 Ti":             { vram: 4,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1050":                { vram: 2,  type: 'discrete', tier: 'entry' },

  // GTX 900 Series (Maxwell)
  "NVIDIA GeForce GTX 980 Ti":              { vram: 6,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 980":                 { vram: 4,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 970":                 { vram: 4,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 960":                 { vram: 4,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 950":                 { vram: 2,  type: 'discrete', tier: 'entry' },

  // NVIDIA TITAN / Professional
  "NVIDIA TITAN RTX":                       { vram: 24, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA TITAN V":                         { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA TITAN Xp":                        { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA TITAN X":                         { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA RTX A6000":                       { vram: 48, type: 'discrete', tier: 'workstation' },
  "NVIDIA RTX A5000":                       { vram: 24, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA RTX A4000":                       { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA RTX 6000 Ada":                    { vram: 48, type: 'discrete', tier: 'workstation' },
  "NVIDIA RTX 5000 Ada":                    { vram: 32, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA RTX 4500 Ada":                    { vram: 24, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA RTX 4000 Ada":                    { vram: 20, type: 'discrete', tier: 'high' },
  "NVIDIA Quadro RTX 8000":                 { vram: 48, type: 'discrete', tier: 'workstation' },
  "NVIDIA Quadro RTX 6000":                 { vram: 24, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA Quadro RTX 5000":                 { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA Quadro RTX 4000":                 { vram: 8,  type: 'discrete', tier: 'mid' },

  // ==================== NVIDIA Laptop / Mobile ====================
  "NVIDIA GeForce RTX 5090 Laptop GPU":     { vram: 24, type: 'discrete', tier: 'ultra-high' },
  "NVIDIA GeForce RTX 5080 Laptop GPU":     { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 5070 Laptop GPU":     { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 5060 Laptop GPU":     { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 4090 Laptop GPU":     { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 4080 Laptop GPU":     { vram: 12, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 4070 Laptop GPU":     { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 4060 Laptop GPU":     { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 4050 Laptop GPU":     { vram: 6,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce RTX 3080 Ti Laptop GPU":  { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 3080 Laptop GPU":     { vram: 16, type: 'discrete', tier: 'high' },
  "NVIDIA GeForce RTX 3070 Ti Laptop GPU":  { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 3070 Laptop GPU":     { vram: 8,  type: 'discrete', tier: 'mid' },
  "NVIDIA GeForce RTX 3060 Laptop GPU":     { vram: 6,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce RTX 3050 Laptop GPU":     { vram: 6,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1660 Ti Laptop GPU":  { vram: 6,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce GTX 1650 Laptop GPU":     { vram: 4,  type: 'discrete', tier: 'entry' },

  // NVIDIA MX Series (entry laptop)
  "NVIDIA GeForce MX550":                   { vram: 2,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce MX450":                   { vram: 2,  type: 'discrete', tier: 'entry' },
  "NVIDIA GeForce MX350":                   { vram: 2,  type: 'discrete', tier: 'entry' },

  // ==================== AMD Desktop ====================

  // RX 90 Series
  "AMD Radeon RX 9070 XT":                  { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 9070":                     { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 9060 XT":                  { vram: 12, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 9060":                     { vram: 8,  type: 'discrete', tier: 'mid' },

  // RX 70 Series
  "AMD Radeon RX 7900 XTX":                 { vram: 24, type: 'discrete', tier: 'ultra-high' },
  "AMD Radeon RX 7900 XT":                  { vram: 20, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 7900 GRE":                 { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 7800 XT":                  { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 7700 XT":                  { vram: 12, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 7600 XT":                  { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 7600":                     { vram: 8,  type: 'discrete', tier: 'mid' },

  // RX 60 Series
  "AMD Radeon RX 6950 XT":                  { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 6900 XT":                  { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 6800 XT":                  { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 6800":                     { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 6750 XT":                  { vram: 12, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 6700 XT":                  { vram: 12, type: 'discrete', tier: 'high' },
  "AMD Radeon RX 6650 XT":                  { vram: 8,  type: 'discrete', tier: 'mid' },
  "AMD Radeon RX 6600 XT":                  { vram: 8,  type: 'discrete', tier: 'mid' },
  "AMD Radeon RX 6600":                     { vram: 8,  type: 'discrete', tier: 'mid' },
  "AMD Radeon RX 6500 XT":                  { vram: 8,  type: 'discrete', tier: 'entry' },
  "AMD Radeon RX 6400":                     { vram: 4,  type: 'discrete', tier: 'entry' },

  // RX 50 Series
  "AMD Radeon RX 5700 XT":                  { vram: 8,  type: 'discrete', tier: 'mid' },
  "AMD Radeon RX 5700":                     { vram: 8,  type: 'discrete', tier: 'mid' },
  "AMD Radeon RX 5600 XT":                  { vram: 6,  type: 'discrete', tier: 'entry' },
  "AMD Radeon RX 5500 XT":                  { vram: 8,  type: 'discrete', tier: 'entry' },
  "AMD Radeon RX 5500":                     { vram: 4,  type: 'discrete', tier: 'entry' },

  // RX 500/400 Series
  "AMD Radeon RX 590":                      { vram: 8,  type: 'discrete', tier: 'entry' },
  "AMD Radeon RX 580":                      { vram: 8,  type: 'discrete', tier: 'entry' },
  "AMD Radeon RX 570":                      { vram: 8,  type: 'discrete', tier: 'entry' },
  "AMD Radeon RX 560":                      { vram: 4,  type: 'discrete', tier: 'entry' },
  "AMD Radeon RX 550":                      { vram: 4,  type: 'discrete', tier: 'entry' },
  "AMD Radeon RX 480":                      { vram: 8,  type: 'discrete', tier: 'entry' },
  "AMD Radeon RX 470":                      { vram: 4,  type: 'discrete', tier: 'entry' },

  // AMD Radeon VII / Vega / Fury
  "AMD Radeon VII":                         { vram: 16, type: 'discrete', tier: 'high' },
  "AMD Radeon RX Vega 64":                  { vram: 8,  type: 'discrete', tier: 'mid' },
  "AMD Radeon RX Vega 56":                  { vram: 8,  type: 'discrete', tier: 'mid' },
  "AMD Radeon R9 Fury X":                   { vram: 4,  type: 'discrete', tier: 'entry' },

  // AMD Professional
  "AMD Radeon PRO W7900":                   { vram: 48, type: 'discrete', tier: 'workstation' },
  "AMD Radeon PRO W7800":                   { vram: 32, type: 'discrete', tier: 'ultra-high' },
  "AMD Radeon PRO W6800":                   { vram: 32, type: 'discrete', tier: 'ultra-high' },
  "AMD Radeon PRO W6600":                   { vram: 8,  type: 'discrete', tier: 'mid' },
  "AMD Radeon PRO W5700":                   { vram: 8,  type: 'discrete', tier: 'mid' },

  // ==================== Intel Arc Desktop ====================
  "Intel Arc B580":                         { vram: 12, type: 'discrete', tier: 'high' },
  "Intel Arc B570":                         { vram: 10, type: 'discrete', tier: 'mid' },
  "Intel Arc A770":                         { vram: 16, type: 'discrete', tier: 'high' },
  "Intel Arc A750":                         { vram: 8,  type: 'discrete', tier: 'mid' },
  "Intel Arc A580":                         { vram: 8,  type: 'discrete', tier: 'mid' },
  "Intel Arc A380":                         { vram: 6,  type: 'discrete', tier: 'entry' },
  "Intel Arc A310":                         { vram: 4,  type: 'discrete', tier: 'entry' },

  // ==================== Apple Silicon ====================
  // Unified memory — VRAM = system RAM minus OS overhead
  // These entries mark Apple Silicon so the matcher treats memory differently
  "Apple M1":                               { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M1 Pro":                           { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M1 Max":                           { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M1 Ultra":                         { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M2":                               { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M2 Pro":                           { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M2 Max":                           { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M2 Ultra":                         { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M3":                               { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M3 Pro":                           { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M3 Max":                           { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M3 Ultra":                         { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M4":                               { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M4 Pro":                           { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },
  "Apple M4 Max":                           { vram: 0, type: 'apple-silicon', tier: 'unified', unified: true },

  // ==================== Integrated Graphics ====================
  "Intel UHD Graphics":                     { vram: 0, type: 'integrated', tier: 'shared', shared: true },
  "Intel Iris Xe Graphics":                 { vram: 0, type: 'integrated', tier: 'shared', shared: true },
  "Intel Iris Plus Graphics":               { vram: 0, type: 'integrated', tier: 'shared', shared: true },
  "Intel Iris Pro Graphics":                { vram: 0, type: 'integrated', tier: 'shared', shared: true },
  "Intel HD Graphics":                      { vram: 0, type: 'integrated', tier: 'shared', shared: true },
  "AMD Radeon Graphics":                    { vram: 0, type: 'integrated', tier: 'shared', shared: true },
  "AMD Radeon Vega":                        { vram: 0, type: 'integrated', tier: 'shared', shared: true },
  "AMD Radeon 780M":                        { vram: 0, type: 'integrated', tier: 'shared', shared: true },
  "AMD Radeon 680M":                        { vram: 0, type: 'integrated', tier: 'shared', shared: true },
};

/**
 * GPU Database Module
 */
const GPUDB = {

  /**
   * Clean up raw renderer string into canonical GPU name.
   * Handles ANGLE wrapper, driver suffixes, and brand normalizations.
   */
  normalizeRenderer(raw) {
    let name = raw;

    // Strip ANGLE wrapper: "ANGLE (NVIDIA, ...)" → just the GPU part
    const angleMatch = name.match(/ANGLE\s*\(([^)]+)\)/i);
    if (angleMatch) {
      name = angleMatch[1];
      // Remove first part if it's the vendor name repeated: "NVIDIA, NVIDIA GeForce RTX 3060 ..."
      const parts = name.split(',');
      if (parts.length >= 2) {
        // Find the part that looks like a GPU name
        for (let i = 1; i < parts.length; i++) {
          const trimmed = parts[i].trim();
          if (/GeForce|Radeon|Arc|GTX|RTX|Quadro|TITAN/i.test(trimmed)) {
            name = trimmed;
            break;
          }
        }
        if (name === angleMatch[1]) {
          // No GPU found in sub-parts, use the whole thing
          name = parts[parts.length - 1].trim();
        }
      }
    }

    // Strip driver info in parentheses: "(0x...)", "(TM)", "(R)"
    name = name.replace(/\s*\(0x[0-9A-Fa-f]+\)\s*/gi, '');
    name = name.replace(/\s*\(TM\)/gi, '');
    name = name.replace(/\s*\(R\)/gi, '');
    name = name.replace(/Direct3D11\s*(vs_\d+_\d+\s*ps_\d+_\d+)?/gi, '');
    name = name.replace(/D3D11\s*(vs_\d+_\d+\s*ps_\d+_\d+)?/gi, '');
    name = name.replace(/OpenGL\s*Engine/i, '');
    name = name.replace(/Vulkan\s*\d+\.\d+/i, '');

    // Clean up whitespace
    name = name.replace(/\s+/g, ' ').trim();

    // Remove trailing commas and clutter
    name = name.replace(/[,;]\s*$/, '');

    return name;
  },

  /**
   * Extract the core GPU model identifier for fuzzy matching.
   * E.g., "NVIDIA GeForce RTX 3060" → "rtx 3060"
   */
  extractKey(name) {
    const lower = name.toLowerCase();
    // Match known patterns
    const patterns = [
      /(rtx\s*\d{4,5}(\s*(ti|super|laptop))?)/i,
      /(gtx\s*\d{3,4}(\s*(ti|super|laptop))?)/i,
      /(radeon\s*rx\s*\d{3,4}(\s*xtx?)?)/i,
      /(radeon\s*r\d\s*\w+)/i,
      /(arc\s*[ab]\d{3})/i,
      /(apple\s*m\d{1,2}\s*(pro|max|ultra)?)/i,
      /(intel\s*(uhd|iris|hd)\s*\w*)/i,
      /(quadro\s*\w+\s*\d+)/i,
      /(titan\s*\w*)/i,
      /(mx\d{3})/i,
    ];
    for (const p of patterns) {
      const m = lower.match(p);
      if (m) return m[1].replace(/\s+/g, ' ').trim();
    }
    return lower;
  },

  /**
   * Look up GPU in database. Returns {vram, type, tier, confidence, matchedKey}
   * Tries exact match → substring match → fuzzy key match → heuristic
   */
  lookup(rawRenderer) {
    const cleaned = this.normalizeRenderer(rawRenderer);
    if (!cleaned || cleaned === 'Unknown') {
      return this.fallback();
    }

    // 1. Exact match
    if (GPU_DATABASE[cleaned]) {
      return { ...GPU_DATABASE[cleaned], confidence: 'exact', matchedKey: cleaned, raw: cleaned };
    }

    // 2. Case-insensitive exact match
    const lower = cleaned.toLowerCase();
    for (const [key, value] of Object.entries(GPU_DATABASE)) {
      if (key.toLowerCase() === lower) {
        return { ...value, confidence: 'exact', matchedKey: key, raw: cleaned };
      }
    }

    // 3. Substring match (DB key is within cleaned string, or vice versa)
    for (const [key, value] of Object.entries(GPU_DATABASE)) {
      if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
        return { ...value, confidence: 'substring', matchedKey: key, raw: cleaned };
      }
    }

    // 4. Fuzzy key match
    const searchKey = this.extractKey(cleaned);
    for (const [key, value] of Object.entries(GPU_DATABASE)) {
      if (this.extractKey(key) === searchKey) {
        return { ...value, confidence: 'fuzzy', matchedKey: key, raw: cleaned };
      }
    }

    // 5. Heuristic by GPU family
    return this.heuristic(cleaned);
  },

  /**
   * Heuristic estimation when GPU not found in database.
   */
  heuristic(cleaned) {
    const lower = cleaned.toLowerCase();

    // NVIDIA heuristics
    if (lower.includes('nvidia') || lower.includes('geforce') || lower.includes('gtx') || lower.includes('rtx')) {
      if (lower.includes('rtx 50') || lower.includes('5090')) return { vram: 16, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('rtx 40') || lower.includes('4090')) return { vram: 12, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('rtx 30') || lower.includes('3090')) return { vram: 10, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('rtx 20') || lower.includes('2080')) return { vram: 8, type: 'discrete', tier: 'mid', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('gtx 16') || lower.includes('1660')) return { vram: 6, type: 'discrete', tier: 'entry', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('gtx 10') || lower.includes('1080')) return { vram: 8, type: 'discrete', tier: 'mid', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('gtx 9')) return { vram: 4, type: 'discrete', tier: 'entry', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('quadro') || lower.includes('rtx a')) return { vram: 16, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('titan')) return { vram: 12, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      // Unknown NVIDIA → assume mid-range
      return { vram: 8, type: 'discrete', tier: 'mid', confidence: 'heuristic', matchedKey: null, raw: cleaned };
    }

    // AMD heuristics
    if (lower.includes('amd') || lower.includes('radeon') || lower.includes('rx')) {
      if (lower.includes('rx 90') || lower.includes('7900')) return { vram: 16, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('rx 70') || lower.includes('7800')) return { vram: 16, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('rx 60') || lower.includes('6900')) return { vram: 12, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('rx 50') || lower.includes('5700')) return { vram: 8, type: 'discrete', tier: 'mid', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('rx 4') || lower.includes('rx 5')) return { vram: 8, type: 'discrete', tier: 'entry', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('rx vega') || lower.includes('fury')) return { vram: 8, type: 'discrete', tier: 'mid', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('radeon vii')) return { vram: 16, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      if (lower.includes('radeon pro w')) return { vram: 16, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      // Unknown AMD discrete
      return { vram: 8, type: 'discrete', tier: 'mid', confidence: 'heuristic', matchedKey: null, raw: cleaned };
    }

    // Intel Arc heuristics
    if (lower.includes('intel') && (lower.includes('arc') || lower.includes('a7') || lower.includes('a5') || lower.includes('b5'))) {
      if (lower.includes('a770') || lower.includes('a750') || lower.includes('b580')) return { vram: 12, type: 'discrete', tier: 'high', confidence: 'heuristic', matchedKey: null, raw: cleaned };
      return { vram: 8, type: 'discrete', tier: 'mid', confidence: 'heuristic', matchedKey: null, raw: cleaned };
    }

    // Apple Silicon heuristics
    if (lower.includes('apple m')) {
      return { vram: 0, type: 'apple-silicon', tier: 'unified', confidence: 'heuristic', matchedKey: null, raw: cleaned, unified: true };
    }

    // Integrated graphics fallback
    if (lower.includes('intel') || lower.includes('uhd') || lower.includes('iris') || lower.includes('hd graphics')) {
      return { vram: 0, type: 'integrated', tier: 'shared', confidence: 'heuristic', matchedKey: null, raw: cleaned, shared: true };
    }

    // Totally unknown
    return this.fallback(cleaned);
  },

  /** Ultimate fallback */
  fallback(raw = 'Unknown') {
    return { vram: 0, type: 'unknown', tier: 'unknown', confidence: 'fallback', matchedKey: null, raw, shared: true };
  },

  /** Get all keys for debugging */
  getAllKeys() {
    return Object.keys(GPU_DATABASE);
  }
};

window.GPUDB = GPUDB;
