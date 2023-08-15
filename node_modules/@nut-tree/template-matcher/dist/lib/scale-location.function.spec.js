"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nut_js_1 = require("@nut-tree/nut-js");
const scale_location_function_1 = require("./scale-location.function");
jest.mock('jimp', () => { });
describe("scaleLocation", () => {
    it("should scale location of a Region for valid scale factors", () => {
        // GIVEN
        const scaleFactor = 0.5;
        const inputRegion = new nut_js_1.Region(100, 100, 10, 10);
        const expectedRegion = new nut_js_1.Region(200, 200, 10, 10);
        // WHEN
        const result = (0, scale_location_function_1.scaleLocation)(inputRegion, scaleFactor);
        // THEN
        expect(result).toEqual(expectedRegion);
    });
    it("should not scale location of a Region for invalid scale factors", () => {
        // GIVEN
        const scaleFactor = 0.0;
        const inputRegion = new nut_js_1.Region(100, 100, 10, 10);
        const expectedRegion = new nut_js_1.Region(100, 100, 10, 10);
        // WHEN
        const result = (0, scale_location_function_1.scaleLocation)(inputRegion, scaleFactor);
        // THEN
        expect(result).toEqual(expectedRegion);
    });
});
//# sourceMappingURL=scale-location.function.spec.js.map