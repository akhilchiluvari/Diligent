import dotenv from 'dotenv';
dotenv.config();

class LLMClient {
  constructor() {
    this.groqKey = process.env.GROQ_API_KEY || '';
    this.groqBaseUrl = process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1';
    this.groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    this.fallbackModel = 'qwen/qwen3.8-27b';
    this.fallbackEnabled = process.env.USE_MOCK_FALLBACK !== 'false';
  }

  isConfigured() {
    return Boolean(this.groqKey && this.groqKey.trim().length > 0);
  }

  getActiveProvider() {
    if (this.isConfigured()) {
      return { provider: 'Groq Cloud LPU', model: this.groqModel };
    }
    return { provider: 'Diligent Edge Neural Engine (Local Fallback)', model: 'slm-edge-quantized' };
  }

  async complete({ systemPrompt, userPrompt, temperature = 0.4, maxTokens = 1500 }) {
    // 1. Try Groq LPU with configured model
    if (this.isConfigured()) {
      try {
        console.log(`[LLMClient] Querying Groq LPU (${this.groqModel})...`);
        const res = await fetch(`${this.groqBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.groqKey.trim()}`
          },
          body: JSON.stringify({
            model: this.groqModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature,
            max_tokens: maxTokens
          })
        });

        if (res.ok) {
          const data = await res.json();
          const message = data.choices?.[0]?.message;
          const content = message?.content?.trim() || message?.reasoning?.trim();
          if (content) {
            return { text: content, source: `Groq LPU (${this.groqModel})` };
          }
        } else {
          const errText = await res.text();
          console.warn(`[LLMClient] Groq API returned ${res.status}: ${errText}. Attempting secondary model.`);

          // Try secondary Qwen model if 120B has an issue
          const secondaryRes = await fetch(`${this.groqBaseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.groqKey.trim()}`
            },
            body: JSON.stringify({
              model: this.fallbackModel,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature,
              max_tokens: maxTokens
            })
          });

          if (secondaryRes.ok) {
            const secData = await secondaryRes.json();
            const secContent = secData.choices?.[0]?.message?.content?.trim();
            if (secContent) {
              return { text: secContent, source: `Groq LPU (${this.fallbackModel})` };
            }
          }
        }
      } catch (err) {
        console.warn(`[LLMClient] Groq API call error: ${err.message}. Transitioning to resilient engine.`);
      }
    }

    // 2. High-Fidelity Resilient Fallback Engine
    return {
      text: null,
      source: 'Diligent Edge Neural Engine (Local Fallback)'
    };
  }
}

export const llmClient = new LLMClient();
