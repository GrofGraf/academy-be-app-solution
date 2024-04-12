import { GoldPriceEntity } from './gold-price.entity';
import { IGoldPriceRepository } from './gold-price.repository';

export class GoldPriceRepositoryMock implements IGoldPriceRepository {
  async create(data: GoldPriceEntity) {
    return data;
  }
  async update(data: GoldPriceEntity) {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getById(id: string) {
    return null;
  }

  async getLast() {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getByPublishedAtOnSource(date: Date) {
    return null;
  }

  async getMany() {
    return [];
  }
}
