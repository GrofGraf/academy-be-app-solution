import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '~common/config/config.module';
import { TrackerModule } from '~modules/tracker/tracker.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DbModule } from '~db/db.module';
import { DataApiModule } from '~data-api/data-api.module';
import { GoldPriceModule } from '~modules/gold-price/gold-price.module';
import { LoggerModule } from '~common/logging/logger.module';
import { UserModule } from '~modules/user/user.module';
import { AuthModule } from '~modules/auth/auth.module';
import { ClsModule } from '~common/cls/cls.module';

@Module({
  imports: [
    ClsModule,
    ConfigModule,
    DbModule,
    TrackerModule,
    ScheduleModule.forRoot(),
    DataApiModule,
    GoldPriceModule,
    UserModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
