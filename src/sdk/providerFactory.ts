import { LLMProvider } from './provider.interface';
import { OpenAIProvider } from './providers/openai.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { ClaudeProvider } from './providers/claude.provider';

export type ProviderKey = 'openai' | 'gemini' | 'claude';

export const providerRegistry: Record<ProviderKey, new () => LLMProvider> = {
  openai: OpenAIProvider,
  gemini: GeminiProvider,
  claude: ClaudeProvider,
};

export const createProvider = (provider: ProviderKey): LLMProvider => {
  const providerCtor = providerRegistry[provider];
  if (!providerCtor) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  return new providerCtor();
};
