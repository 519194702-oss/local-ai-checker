/**
 * models-db.js - AI模型数据库 (45个模型, 含4档量化级别)
 * Local AI Checker - Model Database Module
 *
 * Each model has: id, name, family, org, params, tags, strengthZH,
 *   sizes: { fp16, q8, q4, q3: { diskGB, vramGB, ramGB } },
 *   url, description (zh + en)
 *
 * Memory calculations:
 * - VRAM ≈ model_size_GB + 1.5 (1.5GB context overhead at ~4K tokens Q4)
 * - RAM ≈ model_size_GB + 4 (4GB OS + runtime overhead)
 *
 * Quant sizes are estimated as:
 * - fp16: params * 2 bytes = params * 2 GB
 * - q8: params * 1 byte = params * 1 GB (actually ~1.06 but rounded)
 * - q4: params * 0.55 bytes = params * 0.55 GB (Q4_K_M)
 * - q3: params * 0.4 bytes = params * 0.4 GB (IQ3_M)
 */

const MODELS_DATABASE = [
  // ==================== ULTRA LIGHT (1-3B) ====================
  {
    id: "qwen2.5-1.5b",
    name: "Qwen 2.5 1.5B",
    family: "Qwen",
    org: "Alibaba",
    params: 1.5,
    tags: ["chat", "multilingual", "lightweight"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 3.0, vramGB: 4.5, ramGB: 7.0 },
      q8:   { diskGB: 1.6, vramGB: 3.1, ramGB: 5.6 },
      q4:   { diskGB: 1.0, vramGB: 2.3, ramGB: 4.8 },
      q3:   { diskGB: 0.7, vramGB: 2.0, ramGB: 4.5 },
    },
    url: "https://ollama.com/library/qwen2.5:1.5b",
    description: {
      zh: "阿里轻量级中文模型，适合入门配置和简单对话任务。",
      en: "Alibaba's lightweight Chinese model. Perfect for entry-level hardware and simple chat."
    }
  },
  {
    id: "llama3.2-3b",
    name: "Llama 3.2 3B",
    family: "Llama",
    org: "Meta",
    params: 3.2,
    tags: ["chat", "general", "lightweight"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 6.4, vramGB: 7.9, ramGB: 10.4 },
      q8:   { diskGB: 3.4, vramGB: 4.9, ramGB: 7.4 },
      q4:   { diskGB: 2.0, vramGB: 3.3, ramGB: 5.8 },
      q3:   { diskGB: 1.4, vramGB: 2.7, ramGB: 5.2 },
    },
    url: "https://ollama.com/library/llama3.2:3b",
    description: {
      zh: "Meta 轻量模型，128K上下文，适合边缘设备和移动端部署。",
      en: "Meta's lightweight model with 128K context. Great for edge devices and mobile deployment."
    }
  },
  {
    id: "gemma3-1b",
    name: "Gemma 3 1B",
    family: "Gemma",
    org: "Google",
    params: 1.0,
    tags: ["chat", "multilingual", "lightweight"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 2.0, vramGB: 3.5, ramGB: 6.0 },
      q8:   { diskGB: 1.1, vramGB: 2.6, ramGB: 5.1 },
      q4:   { diskGB: 0.7, vramGB: 2.1, ramGB: 4.6 },
      q3:   { diskGB: 0.5, vramGB: 1.9, ramGB: 4.4 },
    },
    url: "https://ollama.com/library/gemma3:1b",
    description: {
      zh: "Google 最小模型，支持140种语言，适合嵌入式场景。",
      en: "Google's smallest model supporting 140 languages. Ideal for embedded scenarios."
    }
  },
  {
    id: "deepseek-r1-1.5b",
    name: "DeepSeek-R1 1.5B",
    family: "DeepSeek",
    org: "DeepSeek",
    params: 1.5,
    tags: ["reasoning", "lightweight"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 3.0, vramGB: 4.5, ramGB: 7.0 },
      q8:   { diskGB: 1.6, vramGB: 3.1, ramGB: 5.6 },
      q4:   { diskGB: 1.0, vramGB: 2.3, ramGB: 4.8 },
      q3:   { diskGB: 0.7, vramGB: 2.0, ramGB: 4.5 },
    },
    url: "https://ollama.com/library/deepseek-r1:1.5b",
    description: {
      zh: "DeepSeek 推理模型最小版，预算有限时的推理入门之选。",
      en: "DeepSeek's smallest reasoning model. Entry-level reasoning on a budget."
    }
  },
  {
    id: "phi-4-mini",
    name: "Phi-4 Mini",
    family: "Phi",
    org: "Microsoft",
    params: 3.8,
    tags: ["chat", "reasoning", "lightweight"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 7.6, vramGB: 9.1, ramGB: 11.6 },
      q8:   { diskGB: 4.0, vramGB: 5.5, ramGB: 8.0 },
      q4:   { diskGB: 2.5, vramGB: 3.6, ramGB: 6.1 },
      q3:   { diskGB: 1.7, vramGB: 2.9, ramGB: 5.4 },
    },
    url: "https://ollama.com/library/phi-4-mini",
    description: {
      zh: "微软轻量推理模型，参数小但推理能力强，适合低配设备。",
      en: "Microsoft's lightweight model with strong reasoning. Great quality-per-byte ratio."
    }
  },
  {
    id: "qwen2.5-3b",
    name: "Qwen 2.5 3B",
    family: "Qwen",
    org: "Alibaba",
    params: 3.0,
    tags: ["chat", "multilingual", "lightweight"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 6.0, vramGB: 7.5, ramGB: 10.0 },
      q8:   { diskGB: 3.2, vramGB: 4.7, ramGB: 7.2 },
      q4:   { diskGB: 1.9, vramGB: 3.2, ramGB: 5.7 },
      q3:   { diskGB: 1.3, vramGB: 2.6, ramGB: 5.1 },
    },
    url: "https://ollama.com/library/qwen2.5:3b",
    description: {
      zh: "Qwen2.5 3B，中文支持好，轻量级全场景模型。",
      en: "Qwen2.5 3B with good Chinese support. Versatile lightweight model."
    }
  },

  // ==================== LIGHT (7-9B) ====================
  {
    id: "qwen2.5-7b",
    name: "Qwen 2.5 7B",
    family: "Qwen",
    org: "Alibaba",
    params: 7.0,
    tags: ["chat", "multilingual", "general"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 14.0, vramGB: 15.5, ramGB: 18.0 },
      q8:   { diskGB: 7.4, vramGB: 9.0, ramGB: 11.5 },
      q4:   { diskGB: 4.7, vramGB: 5.4, ramGB: 7.9 },
      q3:   { diskGB: 3.2, vramGB: 4.3, ramGB: 6.8 },
    },
    url: "https://ollama.com/library/qwen2.5:7b",
    description: {
      zh: "⭐ 7B级中文王者，8GB显存首选。多语言能力32B以下最强，日常对话和轻量任务必备。",
      en: "⭐ Best multilingual model under 32B. Perfect for 8GB GPUs. Excellent Chinese support."
    }
  },
  {
    id: "llama3.1-8b",
    name: "Llama 3.1 8B",
    family: "Llama",
    org: "Meta",
    params: 8.0,
    tags: ["chat", "general"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 16.0, vramGB: 17.5, ramGB: 20.0 },
      q8:   { diskGB: 8.5, vramGB: 10.0, ramGB: 12.5 },
      q4:   { diskGB: 5.1, vramGB: 6.0, ramGB: 8.5 },
      q3:   { diskGB: 3.6, vramGB: 4.8, ramGB: 7.3 },
    },
    url: "https://ollama.com/library/llama3.1:8b",
    description: {
      zh: "Ollama 下载量最高模型，128K上下文，安全的默认选择。英文强，中文一般。",
      en: "Most pulled Ollama model with 128K context. Safe default choice. Best for English."
    }
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    family: "Mistral",
    org: "Mistral AI",
    params: 7.3,
    tags: ["chat", "general"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 14.6, vramGB: 16.1, ramGB: 18.6 },
      q8:   { diskGB: 7.7, vramGB: 9.2, ramGB: 11.7 },
      q4:   { diskGB: 4.8, vramGB: 5.5, ramGB: 8.0 },
      q3:   { diskGB: 3.3, vramGB: 4.5, ramGB: 7.0 },
    },
    url: "https://ollama.com/library/mistral",
    description: {
      zh: "Apache 2.0 开源协议，经典轻量模型，速度快但上下文仅32K。",
      en: "Apache 2.0 licensed classic. Fast inference but limited to 32K context."
    }
  },
  {
    id: "deepseek-r1-8b",
    name: "DeepSeek-R1 8B",
    family: "DeepSeek",
    org: "DeepSeek",
    params: 8.0,
    tags: ["reasoning", "chat"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 16.0, vramGB: 17.5, ramGB: 20.0 },
      q8:   { diskGB: 8.5, vramGB: 10.0, ramGB: 12.5 },
      q4:   { diskGB: 5.1, vramGB: 6.0, ramGB: 8.5 },
      q3:   { diskGB: 3.6, vramGB: 4.8, ramGB: 7.3 },
    },
    url: "https://ollama.com/library/deepseek-r1:8b",
    description: {
      zh: "DeepSeek-R1 推理系列8B版，8GB显存可跑Q4，链式思维推理入门。",
      en: "DeepSeek-R1 8B reasoning. Runs Q4 on 8GB VRAM. Great intro to chain-of-thought."
    }
  },
  {
    id: "qwen2.5-coder-7b",
    name: "Qwen 2.5 Coder 7B",
    family: "Qwen",
    org: "Alibaba",
    params: 7.6,
    tags: ["coding"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 15.2, vramGB: 16.7, ramGB: 19.2 },
      q8:   { diskGB: 8.1, vramGB: 9.6, ramGB: 12.1 },
      q4:   { diskGB: 5.0, vramGB: 5.7, ramGB: 8.2 },
      q3:   { diskGB: 3.5, vramGB: 4.6, ramGB: 7.1 },
    },
    url: "https://ollama.com/library/qwen2.5-coder:7b",
    description: {
      zh: "⭐ 8GB显存最佳编程模型，HumanEval ~75%，中文代码注释能力强。",
      en: "⭐ Best coding model for 8GB GPUs. ~75% HumanEval. Strong code generation."
    }
  },
  {
    id: "codegemma-7b",
    name: "CodeGemma 7B",
    family: "Gemma",
    org: "Google",
    params: 7.0,
    tags: ["coding"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 14.0, vramGB: 15.5, ramGB: 18.0 },
      q8:   { diskGB: 7.4, vramGB: 9.0, ramGB: 11.5 },
      q4:   { diskGB: 4.7, vramGB: 5.4, ramGB: 7.9 },
      q3:   { diskGB: 3.2, vramGB: 4.3, ramGB: 6.8 },
    },
    url: "https://ollama.com/library/codegemma:7b",
    description: {
      zh: "Google 轻量代码模型，适合内联补全和简单代码生成。",
      en: "Google's lightweight code model. Good for inline completion and simple code gen."
    }
  },
  {
    id: "gemma2-9b",
    name: "Gemma 2 9B",
    family: "Gemma",
    org: "Google",
    params: 9.2,
    tags: ["chat", "general"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 18.4, vramGB: 19.9, ramGB: 22.4 },
      q8:   { diskGB: 9.8, vramGB: 11.3, ramGB: 13.8 },
      q4:   { diskGB: 5.9, vramGB: 6.6, ramGB: 9.1 },
      q3:   { diskGB: 4.1, vramGB: 5.2, ramGB: 7.7 },
    },
    url: "https://ollama.com/library/gemma2:9b",
    description: {
      zh: "Google 9B模型，质量优于多数7B，适合8-12GB显存。",
      en: "Google 9B model outperforming most 7B models. Great for 8-12GB VRAM."
    }
  },
  {
    id: "codellama-7b",
    name: "CodeLlama 7B",
    family: "Llama",
    org: "Meta",
    params: 7.0,
    tags: ["coding"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 14.0, vramGB: 15.5, ramGB: 18.0 },
      q8:   { diskGB: 7.4, vramGB: 9.0, ramGB: 11.5 },
      q4:   { diskGB: 4.7, vramGB: 5.4, ramGB: 7.9 },
      q3:   { diskGB: 3.2, vramGB: 4.3, ramGB: 6.8 },
    },
    url: "https://ollama.com/library/codellama:7b",
    description: {
      zh: "Meta 代码模型7B版，专注Python，稳定但功能不如Qwen-Coder新。",
      en: "Meta's code model. Python-focused. Stable but less feature-rich than newer options."
    }
  },
  {
    id: "starcoder2-7b",
    name: "StarCoder2 7B",
    family: "StarCoder",
    org: "BigCode",
    params: 7.0,
    tags: ["coding"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 14.0, vramGB: 15.5, ramGB: 18.0 },
      q8:   { diskGB: 7.4, vramGB: 9.0, ramGB: 11.5 },
      q4:   { diskGB: 4.7, vramGB: 5.4, ramGB: 7.9 },
      q3:   { diskGB: 3.2, vramGB: 4.3, ramGB: 6.8 },
    },
    url: "https://ollama.com/library/starcoder2:7b",
    description: {
      zh: "BigCode 开源代码模型，宽松许可证，支持600+编程语言。",
      en: "BigCode open-source code model. Permissive license, 600+ programming languages."
    }
  },
  {
    id: "yi-coder-9b",
    name: "Yi-Coder 9B",
    family: "Yi",
    org: "01.AI",
    params: 9.0,
    tags: ["coding"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 18.0, vramGB: 19.5, ramGB: 22.0 },
      q8:   { diskGB: 9.5, vramGB: 11.0, ramGB: 13.5 },
      q4:   { diskGB: 5.8, vramGB: 6.5, ramGB: 9.0 },
      q3:   { diskGB: 4.0, vramGB: 5.1, ramGB: 7.6 },
    },
    url: "https://ollama.com/library/yi-coder:9b",
    description: {
      zh: "零一万物代码模型，中英双语代码能力强，适合8-12GB显存。",
      en: "01.AI bilingual coding model. Strong Chinese+English code generation."
    }
  },
  {
    id: "llama3.2-1b",
    name: "Llama 3.2 1B",
    family: "Llama",
    org: "Meta",
    params: 1.2,
    tags: ["chat", "lightweight"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 2.4, vramGB: 3.9, ramGB: 6.4 },
      q8:   { diskGB: 1.3, vramGB: 2.8, ramGB: 5.3 },
      q4:   { diskGB: 0.8, vramGB: 2.2, ramGB: 4.7 },
      q3:   { diskGB: 0.6, vramGB: 2.0, ramGB: 4.5 },
    },
    url: "https://ollama.com/library/llama3.2:1b",
    description: {
      zh: "Meta 最小模型，128K上下文，适合边缘设备和嵌入式部署。",
      en: "Meta's smallest model with 128K context. Ideal for edge and embedded deployment."
    }
  },
  {
    id: "deepseek-coder-6.7b",
    name: "DeepSeek-Coder 6.7B",
    family: "DeepSeek",
    org: "DeepSeek",
    params: 6.7,
    tags: ["coding"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 13.4, vramGB: 14.9, ramGB: 17.4 },
      q8:   { diskGB: 7.1, vramGB: 8.6, ramGB: 11.1 },
      q4:   { diskGB: 4.4, vramGB: 5.2, ramGB: 7.7 },
      q3:   { diskGB: 3.0, vramGB: 4.1, ramGB: 6.6 },
    },
    url: "https://ollama.com/library/deepseek-coder:6.7b",
    description: {
      zh: "DeepSeek 经典代码模型，支持多种编程语言，性价比高。",
      en: "DeepSeek classic code model. Multi-language support, great value."
    }
  },
  {
    id: "nomic-embed-text",
    name: "Nomic Embed Text v1.5",
    family: "Nomic",
    org: "Nomic AI",
    params: 0.14,
    tags: ["embedding"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 0.3, vramGB: 1.8, ramGB: 4.3 },
      q8:   { diskGB: 0.2, vramGB: 1.7, ramGB: 4.2 },
      q4:   { diskGB: 0.1, vramGB: 1.6, ramGB: 4.1 },
      q3:   { diskGB: 0.1, vramGB: 1.5, ramGB: 4.0 },
    },
    url: "https://ollama.com/library/nomic-embed-text",
    description: {
      zh: "⭐ 默认嵌入模型，137M参数，CPU友好，8K上下文，Matryoshka降维。",
      en: "⭐ Default embedding model. 137M params, CPU-friendly, 8K context, Matryoshka reduction."
    }
  },
  {
    id: "mxbai-embed-large",
    name: "mxbai-embed-large",
    family: "MXBAI",
    org: "MixedBread AI",
    params: 0.34,
    tags: ["embedding"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 0.7, vramGB: 2.2, ramGB: 4.7 },
      q8:   { diskGB: 0.4, vramGB: 1.9, ramGB: 4.4 },
      q4:   { diskGB: 0.2, vramGB: 1.7, ramGB: 4.2 },
      q3:   { diskGB: 0.2, vramGB: 1.7, ramGB: 4.2 },
    },
    url: "https://ollama.com/library/mxbai-embed-large",
    description: {
      zh: "500M以下最佳检索嵌入模型，MTEB 64.68，1K维度。",
      en: "Best retrieval embedding under 500M. MTEB 64.68, 1024 dimensions."
    }
  },

  // ==================== MID (12-16B) ====================
  {
    id: "qwen2.5-14b",
    name: "Qwen 2.5 14B",
    family: "Qwen",
    org: "Alibaba",
    params: 14.0,
    tags: ["chat", "multilingual", "general"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 28.0, vramGB: 29.5, ramGB: 32.0 },
      q8:   { diskGB: 14.8, vramGB: 16.3, ramGB: 18.8 },
      q4:   { diskGB: 9.4, vramGB: 9.2, ramGB: 11.7 },
      q3:   { diskGB: 6.3, vramGB: 7.1, ramGB: 9.6 },
    },
    url: "https://ollama.com/library/qwen2.5:14b",
    description: {
      zh: "⭐ 中端全能冠军，中文一流，12-16GB显存首选。日常和轻度专业任务全覆盖。",
      en: "⭐ Mid-tier all-rounder. Excellent Chinese. Best for 12-16GB GPUs."
    }
  },
  {
    id: "deepseek-r1-14b",
    name: "DeepSeek-R1 14B",
    family: "DeepSeek",
    org: "DeepSeek",
    params: 14.0,
    tags: ["reasoning"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 28.0, vramGB: 29.5, ramGB: 32.0 },
      q8:   { diskGB: 14.8, vramGB: 16.3, ramGB: 18.8 },
      q4:   { diskGB: 9.4, vramGB: 9.2, ramGB: 11.7 },
      q3:   { diskGB: 6.3, vramGB: 7.1, ramGB: 9.6 },
    },
    url: "https://ollama.com/library/deepseek-r1:14b",
    description: {
      zh: "⭐ 推理能力核心区间，12GB显存可跑Q4，链式思维效果出色。",
      en: "⭐ Sweet spot for reasoning. Runs Q4 on 12GB. Excellent chain-of-thought."
    }
  },
  {
    id: "phi-4-14b",
    name: "Phi-4 14B",
    family: "Phi",
    org: "Microsoft",
    params: 14.0,
    tags: ["chat", "reasoning"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 28.0, vramGB: 29.5, ramGB: 32.0 },
      q8:   { diskGB: 14.8, vramGB: 16.3, ramGB: 18.8 },
      q4:   { diskGB: 9.4, vramGB: 9.2, ramGB: 11.7 },
      q3:   { diskGB: 6.3, vramGB: 7.1, ramGB: 9.6 },
    },
    url: "https://ollama.com/library/phi-4:14b",
    description: {
      zh: "⭐ 微软STEM之王，80.4% MATH基准，预算有限的推理神器。",
      en: "⭐ Microsoft's STEM king. 80.4% MATH benchmark. Budget reasoning powerhouse."
    }
  },
  {
    id: "gemma3-12b",
    name: "Gemma 3 12B",
    family: "Gemma",
    org: "Google",
    params: 12.0,
    tags: ["chat", "vision", "multilingual"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 24.0, vramGB: 25.5, ramGB: 28.0 },
      q8:   { diskGB: 12.7, vramGB: 14.2, ramGB: 16.7 },
      q4:   { diskGB: 8.1, vramGB: 7.9, ramGB: 10.4 },
      q3:   { diskGB: 5.5, vramGB: 6.3, ramGB: 8.8 },
    },
    url: "https://ollama.com/library/gemma3:12b",
    description: {
      zh: "Google 多模态12B，含视觉能力，128K上下文，140种语言。",
      en: "Google multimodal 12B with vision. 128K context, 140 languages."
    }
  },
  {
    id: "qwen2.5-coder-14b",
    name: "Qwen 2.5 Coder 14B",
    family: "Qwen",
    org: "Alibaba",
    params: 14.0,
    tags: ["coding"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 28.0, vramGB: 29.5, ramGB: 32.0 },
      q8:   { diskGB: 14.8, vramGB: 16.3, ramGB: 18.8 },
      q4:   { diskGB: 9.4, vramGB: 9.2, ramGB: 11.7 },
      q3:   { diskGB: 6.3, vramGB: 7.1, ramGB: 9.6 },
    },
    url: "https://ollama.com/library/qwen2.5-coder:14b",
    description: {
      zh: "14B编程模型，12-16GB显存用户首选，中文注释和文档生成出色。",
      en: "14B coding model. Best for 12-16GB GPU. Excellent code documentation generation."
    }
  },
  {
    id: "deepseek-coder-v2-16b",
    name: "DeepSeek-Coder V2 16B",
    family: "DeepSeek",
    org: "DeepSeek",
    params: 16.0,
    tags: ["coding"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 32.0, vramGB: 33.5, ramGB: 36.0 },
      q8:   { diskGB: 17.0, vramGB: 18.5, ramGB: 21.0 },
      q4:   { diskGB: 10.6, vramGB: 10.3, ramGB: 12.8 },
      q3:   { diskGB: 7.3, vramGB: 7.9, ramGB: 10.4 },
    },
    url: "https://ollama.com/library/deepseek-coder-v2:16b",
    description: {
      zh: "DeepSeek MoE代码模型，128K上下文，适合长文件重构。",
      en: "DeepSeek MoE coding model. 128K context. Great for long-file refactors."
    }
  },
  {
    id: "mistral-nemo-12b",
    name: "Mistral Nemo 12B",
    family: "Mistral",
    org: "Mistral AI",
    params: 12.0,
    tags: ["chat", "multilingual", "general"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 24.0, vramGB: 25.5, ramGB: 28.0 },
      q8:   { diskGB: 12.7, vramGB: 14.2, ramGB: 16.7 },
      q4:   { diskGB: 8.1, vramGB: 7.9, ramGB: 10.4 },
      q3:   { diskGB: 5.5, vramGB: 6.3, ramGB: 8.8 },
    },
    url: "https://ollama.com/library/mistral-nemo:12b",
    description: {
      zh: "Mistral 12B，128K上下文，多语言，8B到14B间的最佳升级选择。",
      en: "Mistral 12B with 128K context. Best step-up from the 7-8B class."
    }
  },
  {
    id: "starcoder2-15b",
    name: "StarCoder2 15B",
    family: "StarCoder",
    org: "BigCode",
    params: 15.0,
    tags: ["coding"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 30.0, vramGB: 31.5, ramGB: 34.0 },
      q8:   { diskGB: 15.9, vramGB: 17.4, ramGB: 19.9 },
      q4:   { diskGB: 10.1, vramGB: 9.8, ramGB: 12.3 },
      q3:   { diskGB: 6.9, vramGB: 7.5, ramGB: 10.0 },
    },
    url: "https://ollama.com/library/starcoder2:15b",
    description: {
      zh: "BigCode 15B代码模型，宽松许可，支持600+语言，专为IDE集成优化。",
      en: "BigCode 15B code model. Permissive license, 600+ languages. IDE-optimized."
    }
  },
  {
    id: "llava-7b",
    name: "LLaVA 7B",
    family: "LLaVA",
    org: "LLaVA Team",
    params: 7.0,
    tags: ["vision", "chat"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 14.0, vramGB: 15.5, ramGB: 18.0 },
      q8:   { diskGB: 7.4, vramGB: 9.0, ramGB: 11.5 },
      q4:   { diskGB: 4.7, vramGB: 5.4, ramGB: 7.9 },
      q3:   { diskGB: 3.2, vramGB: 4.3, ramGB: 6.8 },
    },
    url: "https://ollama.com/library/llava:7b",
    description: {
      zh: "经典视觉模型7B版，轻量，适合CPU实验和简单图片理解。",
      en: "Classic vision model 7B. Lightweight, good for CPU experiments and basic image understanding."
    }
  },
  {
    id: "llama3.2-vision-11b",
    name: "Llama 3.2 Vision 11B",
    family: "Llama",
    org: "Meta",
    params: 11.0,
    tags: ["vision", "chat"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 22.0, vramGB: 23.5, ramGB: 26.0 },
      q8:   { diskGB: 11.7, vramGB: 13.2, ramGB: 15.7 },
      q4:   { diskGB: 7.5, vramGB: 7.6, ramGB: 10.1 },
      q3:   { diskGB: 5.1, vramGB: 6.1, ramGB: 8.6 },
    },
    url: "https://ollama.com/library/llama3.2-vision:11b",
    description: {
      zh: "⭐ 最强开源视觉语言模型，工具调用，128K上下文。",
      en: "⭐ Strongest open VLM. Tool capable, 128K context."
    }
  },

  // ==================== HEAVY (27-35B) ====================
  {
    id: "qwen2.5-32b",
    name: "Qwen 2.5 32B",
    family: "Qwen",
    org: "Alibaba",
    params: 32.0,
    tags: ["chat", "multilingual", "general"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 64.0, vramGB: 65.5, ramGB: 68.0 },
      q8:   { diskGB: 33.9, vramGB: 35.4, ramGB: 37.9 },
      q4:   { diskGB: 21.9, vramGB: 19.1, ramGB: 21.6 },
      q3:   { diskGB: 14.7, vramGB: 14.3, ramGB: 16.8 },
    },
    url: "https://ollama.com/library/qwen2.5:32b",
    description: {
      zh: "⭐ 高质量通用模型，24GB显存用户首选，中文能力顶级。",
      en: "⭐ High-quality general model. Best for 24GB GPUs. Top-tier Chinese capabilities."
    }
  },
  {
    id: "deepseek-r1-32b",
    name: "DeepSeek-R1 32B",
    family: "DeepSeek",
    org: "DeepSeek",
    params: 32.0,
    tags: ["reasoning"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 64.0, vramGB: 65.5, ramGB: 68.0 },
      q8:   { diskGB: 33.9, vramGB: 35.4, ramGB: 37.9 },
      q4:   { diskGB: 21.9, vramGB: 19.1, ramGB: 21.6 },
      q3:   { diskGB: 14.7, vramGB: 14.3, ramGB: 16.8 },
    },
    url: "https://ollama.com/library/deepseek-r1:32b",
    description: {
      zh: "⭐ DeepSeek-R1蒸馏32B，72.6% LiveCodeBench，24GB显存推理巅峰。",
      en: "⭐ DeepSeek-R1 distill 32B. 72.6% LiveCodeBench. Peak reasoning for 24GB."
    }
  },
  {
    id: "gemma3-27b",
    name: "Gemma 3 27B",
    family: "Gemma",
    org: "Google",
    params: 27.0,
    tags: ["chat", "vision"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 54.0, vramGB: 55.5, ramGB: 58.0 },
      q8:   { diskGB: 28.6, vramGB: 30.1, ramGB: 32.6 },
      q4:   { diskGB: 18.5, vramGB: 16.4, ramGB: 18.9 },
      q3:   { diskGB: 12.4, vramGB: 12.3, ramGB: 14.8 },
    },
    url: "https://ollama.com/library/gemma3:27b",
    description: {
      zh: "Google 多模态27B（MoE 4B活跃），85.6 DocVQA，文档处理最佳。",
      en: "Google multimodal 27B (MoE 4B active). 85.6 DocVQA. Best for document work."
    }
  },
  {
    id: "qwq-32b",
    name: "QwQ 32B",
    family: "Qwen",
    org: "Alibaba",
    params: 32.0,
    tags: ["reasoning"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 64.0, vramGB: 65.5, ramGB: 68.0 },
      q8:   { diskGB: 33.9, vramGB: 35.4, ramGB: 37.9 },
      q4:   { diskGB: 21.9, vramGB: 19.1, ramGB: 21.6 },
      q3:   { diskGB: 14.7, vramGB: 14.3, ramGB: 16.8 },
    },
    url: "https://ollama.com/library/qwq:32b",
    description: {
      zh: "阿里通义千问推理专用版，思维链展示，数学和逻辑推理极强。",
      en: "Alibaba Qwen reasoning specialist. Chain-of-thought display. Strong math & logic."
    }
  },
  {
    id: "yi-34b",
    name: "Yi 34B",
    family: "Yi",
    org: "01.AI",
    params: 34.0,
    tags: ["chat", "general"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 68.0, vramGB: 69.5, ramGB: 72.0 },
      q8:   { diskGB: 36.0, vramGB: 37.5, ramGB: 40.0 },
      q4:   { diskGB: 23.4, vramGB: 20.2, ramGB: 22.7 },
      q3:   { diskGB: 15.7, vramGB: 15.1, ramGB: 17.6 },
    },
    url: "https://ollama.com/library/yi:34b",
    description: {
      zh: "零一万物34B通用模型，中英双语，需要24GB+显存。",
      en: "01.AI 34B general model. Bilingual. Needs 24GB+ VRAM."
    }
  },
  {
    id: "command-r-35b",
    name: "Command R 35B",
    family: "Command R",
    org: "Cohere",
    params: 35.0,
    tags: ["chat", "general"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 70.0, vramGB: 71.5, ramGB: 74.0 },
      q8:   { diskGB: 37.1, vramGB: 38.6, ramGB: 41.1 },
      q4:   { diskGB: 24.2, vramGB: 20.8, ramGB: 23.3 },
      q3:   { diskGB: 16.3, vramGB: 15.5, ramGB: 18.0 },
    },
    url: "https://ollama.com/library/command-r:35b",
    description: {
      zh: "Cohere RAG优化模型，多语言工具使用，企业级AI部署。",
      en: "Cohere RAG-optimized model. Multilingual tool use. Enterprise-grade."
    }
  },
  {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    family: "Mixtral",
    org: "Mistral AI",
    params: 46.7,
    tags: ["chat", "general"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 93.4, vramGB: 94.9, ramGB: 97.4 },
      q8:   { diskGB: 49.5, vramGB: 51.0, ramGB: 53.5 },
      q4:   { diskGB: 32.0, vramGB: 27.2, ramGB: 29.7 },
      q3:   { diskGB: 21.6, vramGB: 19.7, ramGB: 22.2 },
    },
    url: "https://ollama.com/library/mixtral:8x7b",
    description: {
      zh: "Mistral MoE模型，每次激活12.9B参数，质量高但需要48GB+才能跑。",
      en: "Mistral MoE. 12.9B active params. High quality per active param. Needs 48GB+."
    }
  },
  {
    id: "qwen2.5-coder-32b",
    name: "Qwen 2.5 Coder 32B",
    family: "Qwen",
    org: "Alibaba",
    params: 32.0,
    tags: ["coding"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 64.0, vramGB: 65.5, ramGB: 68.0 },
      q8:   { diskGB: 33.9, vramGB: 35.4, ramGB: 37.9 },
      q4:   { diskGB: 21.9, vramGB: 19.1, ramGB: 21.6 },
      q3:   { diskGB: 14.7, vramGB: 14.3, ramGB: 16.8 },
    },
    url: "https://ollama.com/library/qwen2.5-coder:32b",
    description: {
      zh: "⭐ 92.7% HumanEval！代码能力媲美GPT-4o，24GB显存编程终极之选。",
      en: "⭐ 92.7% HumanEval! Competitive with GPT-4o. Ultimate coding model for 24GB."
    }
  },

  // ==================== ULTRA (70B+) ====================
  {
    id: "llama3.3-70b",
    name: "Llama 3.3 70B",
    family: "Llama",
    org: "Meta",
    params: 70.0,
    tags: ["chat", "general"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 140.0, vramGB: 141.5, ramGB: 144.0 },
      q8:   { diskGB: 74.2, vramGB: 75.7, ramGB: 78.2 },
      q4:   { diskGB: 47.5, vramGB: 40.0, ramGB: 42.5 },
      q3:   { diskGB: 32.0, vramGB: 29.5, ramGB: 32.0 },
    },
    url: "https://ollama.com/library/llama3.3:70b",
    description: {
      zh: "Meta旗舰70B，性能对标Llama 3.1 405B，48GB+显卡才能流畅运行。",
      en: "Meta's flagship 70B. Rivals Llama 3.1 405B. Needs 48GB+ GPU for smooth operation."
    }
  },
  {
    id: "qwen2.5-72b",
    name: "Qwen 2.5 72B",
    family: "Qwen",
    org: "Alibaba",
    params: 72.0,
    tags: ["chat", "multilingual", "general"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 144.0, vramGB: 145.5, ramGB: 148.0 },
      q8:   { diskGB: 76.3, vramGB: 77.8, ramGB: 80.3 },
      q4:   { diskGB: 49.0, vramGB: 41.1, ramGB: 43.6 },
      q3:   { diskGB: 33.0, vramGB: 30.3, ramGB: 32.8 },
    },
    url: "https://ollama.com/library/qwen2.5:72b",
    description: {
      zh: "阿里旗舰72B，中文最强大模型之一，需要双3090或A6000级别硬件。",
      en: "Alibaba's flagship 72B. One of the strongest Chinese models. Needs dual 3090 or A6000."
    }
  },
  {
    id: "deepseek-r1-70b",
    name: "DeepSeek-R1 70B",
    family: "DeepSeek",
    org: "DeepSeek",
    params: 70.0,
    tags: ["reasoning"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 140.0, vramGB: 141.5, ramGB: 144.0 },
      q8:   { diskGB: 74.2, vramGB: 75.7, ramGB: 78.2 },
      q4:   { diskGB: 47.5, vramGB: 40.0, ramGB: 42.5 },
      q3:   { diskGB: 32.0, vramGB: 29.5, ramGB: 32.0 },
    },
    url: "https://ollama.com/library/deepseek-r1:70b",
    description: {
      zh: "DeepSeek-R1 70B推理模型，高端推理，需要48GB+硬件。",
      en: "DeepSeek-R1 70B reasoning model. High-end reasoning. Needs 48GB+ hardware."
    }
  },
  {
    id: "llama3.1-70b",
    name: "Llama 3.1 70B",
    family: "Llama",
    org: "Meta",
    params: 70.0,
    tags: ["chat", "general"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 140.0, vramGB: 141.5, ramGB: 144.0 },
      q8:   { diskGB: 74.2, vramGB: 75.7, ramGB: 78.2 },
      q4:   { diskGB: 47.5, vramGB: 40.0, ramGB: 42.5 },
      q3:   { diskGB: 32.0, vramGB: 29.5, ramGB: 32.0 },
    },
    url: "https://ollama.com/library/llama3.1:70b",
    description: {
      zh: "Meta经典70B，128K上下文，企业级应用首选，需要48GB+。",
      en: "Meta classic 70B with 128K context. Enterprise-ready. Needs 48GB+."
    }
  },
  {
    id: "mixtral-8x22b",
    name: "Mixtral 8x22B",
    family: "Mixtral",
    org: "Mistral AI",
    params: 141.0,
    tags: ["chat", "multilingual"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 282.0, vramGB: 283.5, ramGB: 286.0 },
      q8:   { diskGB: 149.5, vramGB: 151.0, ramGB: 153.5 },
      q4:   { diskGB: 96.5, vramGB: 79.1, ramGB: 81.6 },
      q3:   { diskGB: 65.0, vramGB: 57.9, ramGB: 60.4 },
    },
    url: "https://ollama.com/library/mixtral:8x22b",
    description: {
      zh: "Mistral超大MoE，141B总参数，每次39B活跃，需要多卡部署。",
      en: "Mistral massive MoE. 141B total, 39B active per token. Multi-GPU deployment needed."
    }
  },
  {
    id: "command-r-plus-104b",
    name: "Command R+ 104B",
    family: "Command R",
    org: "Cohere",
    params: 104.0,
    tags: ["chat", "general"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 208.0, vramGB: 209.5, ramGB: 212.0 },
      q8:   { diskGB: 110.2, vramGB: 111.7, ramGB: 114.2 },
      q4:   { diskGB: 71.5, vramGB: 58.7, ramGB: 61.2 },
      q3:   { diskGB: 48.0, vramGB: 43.1, ramGB: 45.6 },
    },
    url: "https://ollama.com/library/command-r-plus:104b",
    description: {
      zh: "Cohere超大RAG模型，企业级，多语言，需要双A6000/A100。",
      en: "Cohere massive RAG model. Enterprise, multilingual. Needs dual A6000/A100."
    }
  },
  {
    id: "llama4-scout",
    name: "Llama 4 Scout",
    family: "Llama",
    org: "Meta",
    params: 109.0,
    tags: ["chat", "vision", "multilingual"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 218.0, vramGB: 219.5, ramGB: 222.0 },
      q8:   { diskGB: 115.5, vramGB: 117.0, ramGB: 119.5 },
      q4:   { diskGB: 74.7, vramGB: 61.5, ramGB: 64.0 },
      q3:   { diskGB: 50.0, vramGB: 45.1, ramGB: 47.6 },
    },
    url: "https://ollama.com/library/llama4-scout",
    description: {
      zh: "Meta前沿级16×17B MoE，超大上下文，需要48GB+多卡。",
      en: "Meta frontier 16×17B MoE. Massive context. Needs 48GB+ multi-GPU."
    }
  },
  {
    id: "bge-m3",
    name: "BGE-M3",
    family: "BGE",
    org: "BAAI",
    params: 0.57,
    tags: ["embedding"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 1.2, vramGB: 2.7, ramGB: 5.2 },
      q8:   { diskGB: 0.6, vramGB: 2.1, ramGB: 4.6 },
      q4:   { diskGB: 0.4, vramGB: 1.9, ramGB: 4.4 },
      q3:   { diskGB: 0.3, vramGB: 1.8, ramGB: 4.3 },
    },
    url: "https://ollama.com/library/bge-m3",
    description: {
      zh: "⭐ BAAI多语言嵌入模型，支持稀疏+稠密+ColBERT，中文RAG首选。",
      en: "⭐ BAAI multilingual embedding. Sparse + Dense + ColBERT. Best for Chinese RAG."
    }
  },
  {
    id: "qwen3-embedding-8b",
    name: "Qwen3 Embedding 8B",
    family: "Qwen",
    org: "Alibaba",
    params: 8.0,
    tags: ["embedding"],
    strengthZH: true,
    sizes: {
      fp16: { diskGB: 16.0, vramGB: 17.5, ramGB: 20.0 },
      q8:   { diskGB: 8.5, vramGB: 10.0, ramGB: 12.5 },
      q4:   { diskGB: 5.1, vramGB: 6.0, ramGB: 8.5 },
      q3:   { diskGB: 3.6, vramGB: 4.8, ramGB: 7.3 },
    },
    url: "https://ollama.com/library/qwen3-embedding:8b",
    description: {
      zh: "⭐ MTEB 70.58 SOTA嵌入模型，支持指令，需GPU，8K上下文。",
      en: "⭐ MTEB 70.58 SOTA embedding. Instruction support. Needs GPU. 8K context."
    }
  },
  {
    id: "all-minilm",
    name: "all-MiniLM L6 v2",
    family: "MiniLM",
    org: "Sentence Transformers",
    params: 0.023,
    tags: ["embedding", "lightweight"],
    strengthZH: false,
    sizes: {
      fp16: { diskGB: 0.05, vramGB: 1.6, ramGB: 4.1 },
      q8:   { diskGB: 0.03, vramGB: 1.5, ramGB: 4.0 },
      q4:   { diskGB: 0.02, vramGB: 1.5, ramGB: 4.0 },
      q3:   { diskGB: 0.02, vramGB: 1.5, ramGB: 4.0 },
    },
    url: "https://ollama.com/library/all-minilm",
    description: {
      zh: "超轻量嵌入模型，23M参数，弱但极快，适合资源极度受限场景。",
      en: "Ultra-light embedding model. 23M params. Weak but extremely fast."
    }
  },
];

// Expose globally
window.MODELS_DATABASE = MODELS_DATABASE;
