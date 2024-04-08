import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from '~common/entity/base.entity';
import { Config } from '~common/config/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ValidationError } from '~common/error/validation.error';
import { flatten } from '~utils/validation';
import { AllExceptionsFilter } from '~common/http/exception-response.helper';
import { Logger, PinoLogger } from 'nestjs-pino';
import { requestHandlerMiddleware } from '~common/http/request-handler.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // buffer logs until logger is setup
    abortOnError: false, // force nest.js to bubble up exceptions
  });

  const rootConfig = app.get(Config);

  // This provides the ability to use the IoC container in the domain entities, which are not part of the IoC container.
  useContainer(app);

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.use(requestHandlerMiddleware());

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // use DTOs as runtime types
      whitelist: true, // strip non-whitelisted
      exceptionFactory: (fieldErrors) => {
        const err = new ValidationError(flatten(fieldErrors));
        console.log('ValidationPipe:', err instanceof ValidationError);

        return err;
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(rootConfig.app.port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((e) => {
  PinoLogger.root.error(e.message, e, 'Bootstrap');
  process.exit(1);
});
