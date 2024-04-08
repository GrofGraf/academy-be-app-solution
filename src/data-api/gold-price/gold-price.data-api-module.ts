import { Module } from '@nestjs/common';
import { GoldPriceController } from './gold-price.controller';
import { GoldPriceModule } from '~modules/gold-price/gold-price.module';

@Module({
  imports: [GoldPriceModule],
  controllers: [GoldPriceController],
})
export class GoldPriceDataApiModule {}
