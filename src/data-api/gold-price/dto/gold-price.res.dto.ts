import { Expose } from 'class-transformer';
import { GoldPriceEntity } from '~modules/gold-price/gold-price.entity';

export class GoldPriceResDto {
  @Expose()
  id!: string;

  @Expose()
  price!: number;

  @Expose()
  createdAt!: Date;

  constructor(data: GoldPriceEntity) {
    this.id = data.id;
    this.price = data.price;
    this.createdAt = data.createdAt;
  }
}
