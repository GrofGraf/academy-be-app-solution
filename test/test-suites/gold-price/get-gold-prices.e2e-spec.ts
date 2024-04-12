import { INestApplication } from '@nestjs/common';
import { newUserWithAccessTokenFixture } from '@test/fixtures/user.fixture';

import {
  createTestingApp,
  startTestingApp,
  stopTestingApp,
} from '@test/utils/create-testing-app.utils';
import * as request from 'supertest';

import { API_V1_PATH } from '~common/http/http.constant';
import { GoldPriceDataApiModule } from '~data-api/gold-price/gold-price.data-api-module';

describe('get gold prices', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const module = await createTestingApp({
      imports: [GoldPriceDataApiModule],
    });

    app = await startTestingApp(module);
    ({ accessToken } = await newUserWithAccessTokenFixture(app));
  });

  afterAll(async () => {
    await stopTestingApp(app);
  });

  it('should not get gold prices - invalid auth', async () => {
    const response = await request(app.getHttpServer()).get(
      `/${API_V1_PATH}/gold-prices`,
    );
    expect(response.statusCode).toBe(401);
  });

  it(`should get an empty list of prices`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/${API_V1_PATH}/gold-prices`)
      .set('Authorization', accessToken);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});
