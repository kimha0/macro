"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upperBound = exports.lowerBound = void 0;
function lowerBound(value, boundary, minValue) {
    return (value <= boundary) ? minValue : value;
}
exports.lowerBound = lowerBound;
function upperBound(value, boundary, maxValue) {
    return (value >= boundary) ? maxValue : value;
}
exports.upperBound = upperBound;
//# sourceMappingURL=bound-value.function.js.map