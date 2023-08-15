"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bound_value_function_1 = require("./bound-value.function");
describe("lowerBound function", () => {
    it.each([
        [5, 10, 1, 1],
        [5, 5, 10, 10],
        [5, 1, 10, 5],
        [0, 0, 0, 0]
    ])("Input: %f, Boundary: %f, minValue: %f, Expected: %f", (input, boundary, minValue, expected) => {
        // WHEN
        const result = (0, bound_value_function_1.lowerBound)(input, boundary, minValue);
        // THEN
        expect(result).toBe(expected);
    });
});
describe("upperBound function", () => {
    it.each([
        [5, 10, 1, 5],
        [5, 5, 10, 10],
        [5, 1, 10, 10],
        [5, 5, 5, 5]
    ])("Input: %f, Boundary: %f, maxValue: %f, Expected: %f", (input, boundary, maxValue, expected) => {
        // WHEN
        const result = (0, bound_value_function_1.upperBound)(input, boundary, maxValue);
        // THEN
        expect(result).toBe(expected);
    });
});
//# sourceMappingURL=bound-value.function.spec.js.map