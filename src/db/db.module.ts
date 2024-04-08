import { Global, Module } from '@nestjs/common';

import { PrismaModule } from '~vendor/prisma/prisma.module';

import { UserDbRepository } from './repositories/user.db.repository';
import { USER_REPOSITORY } from '~modules/user/user.repository';
import { GoldPriceDbRepository } from './repositories/gold-price.db.repository';
import { GOLD_PRICE_REPOSITORY } from '~modules/gold-price/gold-price.repository';
import { GOLD_PRICE_NOTE_REPOSITORY } from '~modules/gold-price/submodules/gold-price-note/gold-price-note.repository';
import { GoldPriceNoteDbRepository } from './repositories/gold-price-note.db.repository';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserDbRepository },
    { provide: GOLD_PRICE_REPOSITORY, useClass: GoldPriceDbRepository },
    {
      provide: GOLD_PRICE_NOTE_REPOSITORY,
      useClass: GoldPriceNoteDbRepository,
    },
  ],
  exports: [USER_REPOSITORY, GOLD_PRICE_REPOSITORY, GOLD_PRICE_NOTE_REPOSITORY],
})
export class DbModule {}
