import { ExceptionMessage, ExceptionName } from '../../common/enums/enums.js';

class ForbiddenError extends Error {
  constructor(message = ExceptionMessage.INVALID_TOKEN) {
    super(message);
    this.name = ExceptionName.FORBIDDEN;
  }
}

export { ForbiddenError };
