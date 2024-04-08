import { Injectable } from '@nestjs/common';
import { GoldPriceEntity } from '~modules/gold-price/gold-price.entity';
import { IGoldPriceRepository } from '~modules/gold-price/gold-price.repository';

import { PrismaService } from '~vendor/prisma/prisma.service';

@Injectable()
export class GoldPriceDbRepository implements IGoldPriceRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const gp = await this.prisma.client.goldPrice.findUnique({ where: { id } });

    return gp ? GoldPriceEntity.toDomain(gp) : null;
  }

  async getLast() {
    const gp = await this.prisma.client.goldPrice.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return gp ? GoldPriceEntity.toDomain(gp) : null;
  }

  async getByPublishedAtOnSource(date: Date) {
    const gp = await this.prisma.client.goldPrice.findFirst({
      where: { publishedAtOnSource: date },
    });

    return gp ? GoldPriceEntity.toDomain(gp) : null;
  }

  async getMany() {
    const gps = await this.prisma.client.goldPrice.findMany();

    return gps.map((gp) => GoldPriceEntity.toDomain(gp));
  }

  async create(data: GoldPriceEntity) {
    const gp = await this.prisma.client.goldPrice.create({
      data: data._toPersist('create'),
    });

    return GoldPriceEntity.toDomain(gp);
  }

  async update(data: GoldPriceEntity) {
    const gp = await this.prisma.client.goldPrice.update({
      data: data._toPersist('update'),
      where: { id: data.id },
    });

    return GoldPriceEntity.toDomain(gp);
  }
}
