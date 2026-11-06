import { Injectable } from '@nestjs/common';
import type { RagContext } from './rag.types';

/**
 * Showcase build: market-context retrieval (RAG over a labor-market corpus)
 * is part of the hosted product and not included in this repository.
 * This stand-in keeps the same interface and always returns empty context,
 * so resume analysis and job match run on the LLM alone.
 */
@Injectable()
export class RagService {
  buildResumeContext(_args: { role?: string; resume: string }): Promise<RagContext> {
    return Promise.resolve(emptyContext());
  }

  buildJobMatchContext(_args: {
    role?: string;
    resume: string;
    jobDescription: string;
  }): Promise<RagContext> {
    return Promise.resolve(emptyContext());
  }
}

function emptyContext(): RagContext {
  return {
    promptContext: '',
    marketSignals: [],
    priorityGaps: [],
    citations: [],
  };
}
