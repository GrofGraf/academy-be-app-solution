import { GoldPriceEntity } from './gold-price.entity';

export const GOLD_PRICE_REPOSITORY = Symbol('GOLD_PRICE_REPOSITORY');

export interface IGoldPriceRepository {
  create(data: GoldPriceEntity): Promise<GoldPriceEntity>;
  update(data: GoldPriceEntity): Promise<GoldPriceEntity>;
  getById(id: string): Promise<GoldPriceEntity | null>;
  getLast(): Promise<GoldPriceEntity | null>;
  getByPublishedAtOnSource(date: Date): Promise<GoldPriceEntity | null>;
  getMany(): Promise<GoldPriceEntity[]>;
}
