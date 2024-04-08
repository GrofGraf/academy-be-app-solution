import { Module } from '@nestjs/common';

import { CreateGoldPriceNoteUseCase } from './use-cases/create-gold-price-note.use-case';

@Module({
  providers: [CreateGoldPriceNoteUseCase],
  exports: [CreateGoldPriceNoteUseCase],
})
export class GoldPriceNoteModule {}
