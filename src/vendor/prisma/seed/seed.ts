import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '~common/config/config.module';

import { userSeed } from './user.seed';
import { DbModule } from '~db/db.module';
import { useContainer } from '~common/entity/base.entity';

@Module({
  imports: [ConfigModule, DbModule],
})
export class AppModule {}

async function bootstrap() {
  console.log('Seeding database...');
  const app = await NestFactory.create(AppModule);

  useContainer(app);

  await userSeed(app);

  console.log('Seeding database completed!');
}

bootstrap();
