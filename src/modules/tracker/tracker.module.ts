import { Module } from '@nestjs/common';
import { GoldPriceTrackerCron } from './use-cases/gold-price-tracker.cron';

@Module({
  providers: [GoldPriceTrackerCron],
})
export class TrackerModule {}
