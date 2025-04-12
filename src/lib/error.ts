/**
 * ...
 */
export class BadRequestError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? "Request is malformed.", options);
  }
}

/**
 * ...
 */
export class ForbiddenError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? "That is forbidden.", options);
  }
}

/**
 * ...
 */
export class UnauthorizedError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? "You are not authorized to do that.", options);
  }
}

/**
 * ...
 */
export class NotFoundError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? "A required record was not found.", options);
  }
}

/**
 * ...
 */
export class GameStateError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(
      message ?? "Game state doesn't allow that action to be performed.",
      options
    );
  }
}
