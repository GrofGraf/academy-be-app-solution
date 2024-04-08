import { Module } from '@nestjs/common';

import { GoldPriceNoteModule } from './submodules/gold-price-note/gold-price-note.module';

@Module({
  imports: [GoldPriceNoteModule],
  providers: [],
  exports: [GoldPriceNoteModule],
})
export class GoldPriceModule {}
