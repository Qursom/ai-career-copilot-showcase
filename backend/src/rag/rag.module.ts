import { Module } from '@nestjs/common';
import { RagService } from './rag.service';

/** Showcase build: provides the no-op RagService (see rag.service.ts). */
@Module({
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}
