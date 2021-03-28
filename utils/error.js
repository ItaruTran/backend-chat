exports.HTTPError = class HTTPError extends Error {
  /**
   * @param {number} [code]
   * @param {string} [message]
   * @param {any} [data]
   */
  constructor(code, message, data) {
    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    this.statusCode = code;
    this.data = data
  }
}

exports.ForbiddenError = class ForbiddenError extends this.HTTPError {
  /**
   * @param {string} [message]
   * @param {any} [data]
   */
  constructor(message, data) {
    super(403, message || 'Forbidden', data)
  }
}

exports.ValidationError = class ValidationError extends this.HTTPError {
  /**
 * @param {string} [message]
 * @param {any} [data]
 */
  constructor(message, data) {
    super(422, message || 'Validation error', data)
  }
}
