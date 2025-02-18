"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("../../utils/logger"));
// Create a custom Morgan format
const morganFormat = ":method :url :status :res[content-length] - :response-time ms";
// Create a stream that writes to our Winston logger
const stream = {
    write: (message) => {
        logger_1.default.info(message.trim());
    },
};
exports.loggingMiddleware = (0, morgan_1.default)(morganFormat, { stream });
