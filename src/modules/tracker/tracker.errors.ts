import { BaseError } from '~common/error/base.error';

export class TrackerRateLimitError extends BaseError {
  constructor(cause?: Error) {
    super({
      code: TrackerRateLimitError.name,
      message: 'Rate limit exceeded',
      cause,
    });
  }
}

export class TrackerGatewayTimeOutError extends BaseError {
  constructor(cause?: Error) {
    super({
      code: TrackerGatewayTimeOutError.name,
      message: 'Gateway timeout',
      cause,
    });
  }
}

export class TrackerUnknownError extends BaseError {
  constructor(cause?: Error) {
    super({
      code: TrackerUnknownError.name,
      message: 'Unknown error occurred',
      cause,
    });
  }
}
