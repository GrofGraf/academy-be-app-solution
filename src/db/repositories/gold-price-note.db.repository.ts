import { Injectable } from '@nestjs/common';

import { GoldPriceNoteEntity } from '~modules/gold-price/submodules/gold-price-note/gold-price-note.entity';
import { IGoldPriceNoteRepository } from '~modules/gold-price/submodules/gold-price-note/gold-price-note.repository';

import { PrismaService } from '~vendor/prisma/prisma.service';

@Injectable()
export class GoldPriceNoteDbRepository implements IGoldPriceNoteRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: GoldPriceNoteEntity) {
    const note = await this.prisma.client.goldPriceNote.create({
      data: data._toPersist('create'),
    });

    return GoldPriceNoteEntity.toDomain(note);
  }
}
