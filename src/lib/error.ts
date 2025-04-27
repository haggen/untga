export class HttpError extends Error {
  status: number;

  constructor(
    status = 500,
    message = "Unexpected error.",
    options?: ErrorOptions
  ) {
    super(message, options);
    this.status = status;
  }
}

export class BadRequestError extends HttpError {
  constructor(message?: string, options?: ErrorOptions) {
    super(400, message ?? "Request is malformed.", options);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string, options?: ErrorOptions) {
    super(403, message ?? "That is forbidden.", options);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string, options?: ErrorOptions) {
    super(401, message ?? "You are not authorized to do that.", options);
  }
}

export class NotFoundError extends HttpError {
  constructor(message?: string, options?: ErrorOptions) {
    super(404, message ?? "A required record was not found.", options);
  }
}

export function toJSON(err: Error): Record<string, unknown> {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
    cause: err.cause instanceof Error ? toJSON(err.cause) : err.cause,
  };
}
