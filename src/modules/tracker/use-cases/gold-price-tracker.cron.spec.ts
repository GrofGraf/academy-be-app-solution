import { Test, TestingModule } from '@nestjs/testing';
import * as nock from 'nock';

import { GoldPriceTrackerCron } from './gold-price-tracker.cron';
import { GoldPriceRepositoryMock } from '~modules/gold-price/gold-price.repository.mock';
import { GOLD_PRICE_REPOSITORY } from '~modules/gold-price/gold-price.repository';
import { TrackerConfig } from '../tracker.config';
import { ConfigModule } from '~common/config/config.module';
import { GatewayTimeOutTrackerError } from '../tracker.errors';

describe('gold price tracker cron', () => {
  let service: GoldPriceTrackerCron;
  let trackerConfig: TrackerConfig;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        GoldPriceTrackerCron,
        { provide: GOLD_PRICE_REPOSITORY, useClass: GoldPriceRepositoryMock },
      ],
    }).compile();

    service = module.get(GoldPriceTrackerCron);
    trackerConfig = module.get(TrackerConfig);
  });

  it('should not parse #BCprice from html', async () => {
    const loggerSpy = jest.spyOn(service['logger'], 'warn');

    nock(trackerConfig.url).get('/').reply(200, '<html><body>></body></html>');

    await service.handleCron();

    expect(loggerSpy).toHaveBeenCalledWith(
      'Price not found - #BCprice not found',
    );
  });

  it('should log 504 status from the source site', async () => {
    const loggerSpy = jest.spyOn(service['logger'], 'error');

    nock(trackerConfig.url).get('/').reply(504, '<html><body>></body></html>');

    await service.handleCron();

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.any(GatewayTimeOutTrackerError),
    );
  });
});
