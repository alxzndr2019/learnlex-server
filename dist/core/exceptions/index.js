"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class InfrastructureError extends Error {
    constructor(message) {
        super(message);
        this.name = "InfrastructureError";
    }
}
exports.InfrastructureError = InfrastructureError;
