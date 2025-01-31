import morgan from "morgan";
import logger from "../../utils/logger";

// Create a custom Morgan format
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms";

// Create a stream that writes to our Winston logger
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export const loggingMiddleware = morgan(morganFormat, { stream });
