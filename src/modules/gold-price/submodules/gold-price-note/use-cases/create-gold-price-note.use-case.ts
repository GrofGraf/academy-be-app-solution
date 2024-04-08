import { Inject, Injectable } from '@nestjs/common';

import {
  GOLD_PRICE_NOTE_REPOSITORY,
  IGoldPriceNoteRepository,
} from '../gold-price-note.repository';
import {
  CreateGoldPriceNote,
  GoldPriceNoteEntity,
} from '../gold-price-note.entity';
import { GoldPriceEntity } from '~modules/gold-price/gold-price.entity';

@Injectable()
export class CreateGoldPriceNoteUseCase {
  constructor(
    @Inject(GOLD_PRICE_NOTE_REPOSITORY)
    private goldPriceNoteRepository: IGoldPriceNoteRepository,
  ) {}

  async execute(
    gp: GoldPriceEntity,
    data: Omit<CreateGoldPriceNote, 'goldPriceId' | 'userId'>,
  ) {
    return this.goldPriceNoteRepository.create(
      GoldPriceNoteEntity.new({
        ...data,
        goldPriceId: gp.id,
        userId: '4c8388cc-e9b9-420d-ae27-a46be06d426b',
      }),
    );
  }
}
