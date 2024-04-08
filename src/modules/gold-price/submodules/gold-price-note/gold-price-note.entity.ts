import { GoldPriceNote } from '@prisma/client';
import { Expose } from 'class-transformer';
import { randomUUID } from 'node:crypto';

import { BaseEntity, trackChanges } from '~common/entity/base.entity';

export type CreateGoldPriceNote = Omit<
  GoldPriceNote,
  'id' | 'createdAt' | 'updatedAt'
>;

export class GoldPriceNoteEntity
  extends BaseEntity<GoldPriceNote>
  implements GoldPriceNote
{
  @Expose()
  id!: string;

  @Expose()
  text!: string;

  @Expose()
  goldPriceId!: string;

  @Expose()
  userId!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  private constructor(data: GoldPriceNote) {
    super();
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.text = data.text;
    this.goldPriceId = data.goldPriceId;
    this.userId = data.userId;
  }

  static new(data: CreateGoldPriceNote) {
    return new GoldPriceNoteEntity({
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    });
  }

  static toDomain(data: GoldPriceNote) {
    return trackChanges<GoldPriceNoteEntity>(new GoldPriceNoteEntity(data));
  }
}
