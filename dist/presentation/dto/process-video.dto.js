"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessVideoDTO = void 0;
const zod_1 = require("zod");
exports.ProcessVideoDTO = zod_1.z.object({
    url: zod_1.z.string().url(),
    userId: zod_1.z.string(),
});
