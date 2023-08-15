"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nut_js_1 = require("@nut-tree/nut-js");
const template_matching_finder_class_1 = __importDefault(require("./lib/template-matching-finder.class"));
const finder = new template_matching_finder_class_1.default();
nut_js_1.providerRegistry.registerImageFinder(finder);
//# sourceMappingURL=index.js.map