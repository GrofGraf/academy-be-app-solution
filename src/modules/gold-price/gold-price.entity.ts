import { GoldPrice } from '@prisma/client';
import { Expose } from 'class-transformer';
import { randomUUID } from 'node:crypto';

import { BaseEntity, trackChanges } from '~common/entity/base.entity';

export type CreateGoldPrice = Omit<GoldPrice, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateGoldPrice = Partial<CreateGoldPrice>;

export class GoldPriceEntity
  extends BaseEntity<GoldPrice>
  implements GoldPrice
{
  @Expose()
  id!: string;

  @Expose()
  price!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  publishedAtOnSource!: Date;

  @Expose()
  updatedAt!: Date;

  private constructor(data: GoldPrice) {
    super();
    this.id = data.id;
    this.price = data.price;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.publishedAtOnSource = data.publishedAtOnSource;
  }

  static new(data: CreateGoldPrice) {
    return new GoldPriceEntity({
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    });
  }

  update(changes: UpdateGoldPrice) {
    this._operation = 'update';

    return Object.assign(this, {
      ...changes,
      updatedAt: new Date(),
    });
  }

  static toDomain(data: GoldPrice) {
    return trackChanges<GoldPriceEntity>(new GoldPriceEntity(data));
  }
}
