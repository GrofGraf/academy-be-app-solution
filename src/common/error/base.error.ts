export interface BaseErrorArgs {
  code: string;
  message?: string;
  meta?: Record<string, any>;
  cause?: Error;
}

/**
 * Base class for all internal errors
 */
export class BaseError extends Error {
  readonly code: string;
  readonly meta?: Record<string, any>;

  constructor(data: BaseErrorArgs) {
    super(data?.message, {
      cause: data.cause,
    });

    this.code = data.code;
    this.meta = data?.meta;
  }
}
