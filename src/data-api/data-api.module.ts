import { Module } from '@nestjs/common';
import { GoldPriceDataApiModule } from './gold-price/gold-price.data-api-module';
import { AuthDataApiModule } from './auth/auth.data-api-module';

@Module({
  imports: [GoldPriceDataApiModule, AuthDataApiModule],
})
export class DataApiModule {}
