import { LLMProvider, ProviderOptions, ProviderResponse } from '../provider.interface';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../../config/env';

export class OpenAIProvider implements LLMProvider {
  public providerName = 'openai';
  public defaultModel = 'gpt-4.1';
  public supportedModels = ['gpt-4.1', 'gpt-4o-mini', 'gpt-3.5-turbo'];
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ 
      apiKey: OPENAI_API_KEY,
      timeout: 10000 // 10 seconds timeout to prevent hanging on network issues
    });
  }

  async generate(prompt: string, opts: ProviderOptions = {}): Promise<ProviderResponse> {
    let model = opts.model ?? this.defaultModel;
    if (model === 'gpt-4.1') {
      model = 'gpt-4o-mini';
    }

    try {
      const response = await this.client.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: opts.maxTokens ?? 1024,
        temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.7,
      });

      const choice = response.choices?.[0];
      const text = (choice?.message?.content as string) ?? '';
      const usage = response.usage
        ? {
            prompt_tokens: response.usage.prompt_tokens ?? 0,
            completion_tokens: response.usage.completion_tokens ?? 0,
            total_tokens: response.usage.total_tokens ?? 0,
          }
        : undefined;

      return { text, usage, provider: this.providerName, model: opts.model ?? this.defaultModel };
    } catch (err: any) {
      console.error(`OpenAI API error: ${err?.message || err}`);
      throw new Error(`OpenAI API error: ${err?.message || 'API call failed'}`);
    }
  }
}
