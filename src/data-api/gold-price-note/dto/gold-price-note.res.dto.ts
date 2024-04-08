import { Expose } from 'class-transformer';

import { GoldPriceNoteEntity } from '~modules/gold-price/submodules/gold-price-note/gold-price-note.entity';

export class GoldPriceNoteResDto {
  @Expose()
  id!: string;

  @Expose()
  text!: string;

  @Expose()
  createdAt!: Date;

  constructor(data: GoldPriceNoteEntity) {
    this.id = data.id;
    this.text = data.text;
    this.createdAt = data.createdAt;
  }
}
