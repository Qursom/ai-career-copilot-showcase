import { Logger } from '@nestjs/common';
import type { BaseMessage } from '@langchain/core/messages';
import { ChatGroq } from '@langchain/groq';
import {
  BaseLangChainProvider,
  type StructuredOutputMethod,
} from './base-langchain.provider';

export interface GroqProviderOptions {
  apiKey: string;
  model: string;
  defaultTimeoutMs: number;
}

/**
 * Groq via LangChain `ChatGroq`. `jsonMode` is more portable than strict
 * json_schema on Groq's current models; BaseLangChainProvider still falls
 * back to invoke + JSON parse if the bind or API rejects it. That fallback
 * still asks Groq for `json_object` output so the reply is parseable JSON.
 */
export class GroqLangChainProvider extends BaseLangChainProvider {
  readonly name = 'groq';
  private readonly logger = new Logger(GroqLangChainProvider.name);
  protected readonly model: ChatGroq;
  protected readonly defaultTimeoutMs: number;
  protected readonly structuredOutputMethod: StructuredOutputMethod = 'jsonMode';

  constructor(opts: GroqProviderOptions) {
    super();
    this.defaultTimeoutMs = opts.defaultTimeoutMs;
    this.model = new ChatGroq({
      apiKey: opts.apiKey,
      model: opts.model,
      temperature: 0.2,
      maxRetries: 0,
      // gpt-oss spends most of its output on hidden reasoning by default,
      // which truncates long JSON and burns the free-tier token budget.
      ...(isReasoningModel(opts.model) ? { reasoningEffort: 'low' } : {}),
    });
    this.logger.debug(`LangChain ChatGroq model=${opts.model}`);
  }

  protected invokeForJson(
    messages: BaseMessage[],
  ): Promise<{ content: unknown }> {
    return this.model.invoke(messages, {
      response_format: { type: 'json_object' },
    });
  }
}

function isReasoningModel(model: string): boolean {
  return model.startsWith('openai/gpt-oss');
}
