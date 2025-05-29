type HttpErrorOptions = {
  headers?: HeadersInit;
};

export class HttpError extends Error {
  status: number;
  headers?: HeadersInit;

  constructor(
    status = 500,
    message = "Unexpected error.",
    options?: ErrorOptions & HttpErrorOptions
  ) {
    super(message, options);
    this.status = status;
    this.headers = options?.headers;
  }
}

export class BadRequestError extends HttpError {
  constructor(message?: string, options?: ErrorOptions & HttpErrorOptions) {
    super(400, message ?? "Request is malformed.", options);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string, options?: ErrorOptions & HttpErrorOptions) {
    super(403, message ?? "That is forbidden.", options);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string, options?: ErrorOptions & HttpErrorOptions) {
    super(401, message ?? "You are not authorized to do that.", options);
  }
}

export class NotFoundError extends HttpError {
  constructor(message?: string, options?: ErrorOptions & HttpErrorOptions) {
    super(404, message ?? "A required record was not found.", options);
  }
}

/**
 * Serialize an error object to JSON.
 */
export function toJSON(err: Error): object {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
    cause: err.cause instanceof Error ? toJSON(err.cause) : err.cause,
  };
}
