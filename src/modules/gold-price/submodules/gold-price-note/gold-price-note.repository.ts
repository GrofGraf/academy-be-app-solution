import { GoldPriceNoteEntity } from './gold-price-note.entity';

export const GOLD_PRICE_NOTE_REPOSITORY = Symbol('GOLD_PRICE_NOTE_REPOSITORY');

export interface IGoldPriceNoteRepository {
  create(data: GoldPriceNoteEntity): Promise<GoldPriceNoteEntity>;
}
