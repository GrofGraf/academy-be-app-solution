import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TrackerConfig } from '../tracker.config';
import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import { GoldPriceEntity } from '~modules/gold-price/gold-price.entity';
import {
  GOLD_PRICE_REPOSITORY,
  IGoldPriceRepository,
} from '~modules/gold-price/gold-price.repository';
import { DateTime, Interval } from 'luxon';
import {
  GatewayTimeOutTrackerError,
  RateLimitTrackerError,
  UnknownTrackerError,
} from '../tracker.errors';
import { match } from 'ts-pattern';

@Injectable()
export class GoldPriceTrackerCron {
  private readonly logger = new Logger(GoldPriceTrackerCron.name);

  constructor(
    private trackerConfig: TrackerConfig,
    @Inject(GOLD_PRICE_REPOSITORY)
    private goldPriceRepository: IGoldPriceRepository,
  ) {}

  @Cron('1 * * * * *')
  async handleCron() {
    try {
      const shouldCheck = await this.shouldCheckPrice();

      if (!shouldCheck) {
        this.logger.log('Price already stored for today');
        return;
      }

      const { data } = await axios.get(this.trackerConfig.url, {
        headers: {
          'X-API-KEY': this.trackerConfig.apiKey,
        },
      });

      const price = this.getPriceFromHtml(data);

      if (!price) {
        return;
      }

      const publishedAtOnSource = this.getPublishedAtTimeFromHtml(data);

      if (!publishedAtOnSource) {
        return;
      }

      const shouldStore = await this.shouldStorePrice(publishedAtOnSource);

      if (!shouldStore) {
        this.logger.log(
          'Price already stored for the published date on source',
        );
        return;
      }

      await this.goldPriceRepository.create(
        GoldPriceEntity.new({
          price,
          publishedAtOnSource: publishedAtOnSource.toJSDate(),
        }),
      );

      this.logger.log(price);
    } catch (error) {
      let err = error;

      if (error instanceof AxiosError) {
        err = match(error.status)
          .with(504, () => {
            return new GatewayTimeOutTrackerError(error as AxiosError);
          })
          .with(429, () => {
            return new RateLimitTrackerError(error as AxiosError);
          })
          .otherwise(() => {
            return new UnknownTrackerError(error as AxiosError);
          });
      }

      this.logger.error(err);
    }
  }

  private async shouldCheckPrice() {
    let shouldCheck = false;
    const lastPrice = await this.goldPriceRepository.getLast();

    if (!lastPrice) {
      shouldCheck = true;
    } else {
      const interval = Interval.fromDateTimes(
        DateTime.now().toUTC().startOf('day'),
        DateTime.now().toUTC().endOf('day'),
      );

      const dateTimeToCheck = DateTime.fromJSDate(lastPrice.createdAt);

      // Check if the current date is within the interval
      shouldCheck = !interval.contains(dateTimeToCheck);
    }

    return shouldCheck;
  }

  private async shouldStorePrice(publishedAtOnSource: DateTime) {
    let shouldStore = false;
    const storedPrice = await this.goldPriceRepository.getByPublishedAtOnSource(
      publishedAtOnSource.toJSDate(),
    );

    if (!storedPrice) {
      shouldStore = true;
    }

    return shouldStore;
  }

  private getPriceFromHtml(html: string): number | undefined {
    const $ = cheerio.load(html);
    const priceRaw = $('#BCprice').text();

    if (!priceRaw) {
      this.logger.warn('Price not found - #BCprice not found');
      return;
    }

    const priceString = priceRaw.split(' ')[0];

    if (!priceString) {
      this.logger.warn('Price not found - price string not found');
      return;
    }

    return parseFloat(priceString.replace(',', '.'));
  }

  private getPublishedAtTimeFromHtml(html: string) {
    const $ = cheerio.load(html);
    const refreshTimeRaw = $('.bc-price-info-refresh').text();

    if (!refreshTimeRaw) {
      this.logger.warn(
        'Price refresh time not found - #BCrefreshTime not found',
      );
      return;
    }

    const timeString = refreshTimeRaw.split(': ')[1];

    if (!timeString) {
      this.logger.warn('Price refresh time not found - time string not found');
      return;
    }

    const timeObj = DateTime.fromFormat(timeString, 'dd.MM.yyyy HH:mm');

    if (!timeObj.isValid) {
      this.logger.warn(
        'Price refresh time not found - time string not parsable',
      );
      return;
    }

    return timeObj;
  }
}
