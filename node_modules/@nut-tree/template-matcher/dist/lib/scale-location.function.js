"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaleLocation = void 0;
const nut_js_1 = require("@nut-tree/nut-js");
const bound_value_function_1 = require("./bound-value.function");
function scaleLocation(result, scaleFactor) {
    const boundScaleFactor = (0, bound_value_function_1.lowerBound)(scaleFactor, 0.0, 1.0);
    return new nut_js_1.Region(result.left / boundScaleFactor, result.top / boundScaleFactor, result.width, result.height);
}
exports.scaleLocation = scaleLocation;
//# sourceMappingURL=scale-location.function.js.map