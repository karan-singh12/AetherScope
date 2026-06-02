import { LLMProvider, ProviderOptions, ProviderResponse } from '../provider.interface';

export class GeminiProvider implements LLMProvider {
  public providerName = 'gemini';
  public defaultModel = 'gemini-v1';
  public supportedModels = ['gemini-v1'];

  async generate(_prompt: string, _opts: ProviderOptions = {}): Promise<ProviderResponse> {
    throw new Error('Gemini provider is not implemented yet');
  }
}
