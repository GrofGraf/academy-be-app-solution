import { BaseError } from '~common/error/base.error';

export class RateLimitTrackerError extends BaseError {
  RateLimitTrackerError = true;
  code = RateLimitTrackerError.name;

  constructor(cause?: Error) {
    super({
      message: 'Rate limit exceeded',
      cause,
    });
  }
}

export class GatewayTimeOutTrackerError extends BaseError {
  TrackerGatewayTimeOutError = true;
  code = GatewayTimeOutTrackerError.name;

  constructor(cause?: Error) {
    super({
      message: 'Gateway timeout',
      cause,
    });
  }
}

export class UnknownTrackerError extends BaseError {
  UnknownTrackerError = true;
  code = UnknownTrackerError.name;

  constructor(cause?: Error) {
    super({
      message: 'Unknown error occurred',
      cause,
    });
  }
}
