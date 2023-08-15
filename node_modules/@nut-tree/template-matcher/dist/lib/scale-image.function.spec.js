"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const scale_image_function_1 = require("./scale-image.function");
const image_processor_class_1 = require("./image-processor.class");
const image_reader_class_1 = __importDefault(require("./image-reader.class"));
jest.mock('jimp', () => {
});
describe("scaleImage", () => {
    it.each([[0.5], [1.5]])("should scale an image correctly by factor %f", async (scaleFactor) => {
        // GIVEN
        const imageReader = new image_reader_class_1.default();
        const pathToinput = path.resolve(__dirname, "./__mocks__/mouse.png");
        const inputImage = await imageReader.load(pathToinput);
        const inputMat = await (0, image_processor_class_1.fromImageWithoutAlphaChannel)(inputImage);
        const expectedWidth = Math.floor(inputMat.cols * scaleFactor);
        const expectedHeight = Math.floor(inputMat.rows * scaleFactor);
        // WHEN
        const result = await (0, scale_image_function_1.scaleImage)(inputMat, scaleFactor);
        // THEN
        expect(result.rows).toBe(expectedHeight);
        expect(result.cols).toBe(expectedWidth);
    });
    it.each([[0], [-0.25]])("should keep scale if factor <= 0: Scale %f", async (scaleFactor) => {
        // GIVEN
        const imageReader = new image_reader_class_1.default();
        const pathToinput = path.resolve(__dirname, "./__mocks__/mouse.png");
        const inputImage = await imageReader.load(pathToinput);
        const inputMat = await (0, image_processor_class_1.fromImageWithoutAlphaChannel)(inputImage);
        const expectedWidth = inputMat.cols;
        const expectedHeight = inputMat.rows;
        // WHEN
        const result = await (0, scale_image_function_1.scaleImage)(inputMat, scaleFactor);
        // THEN
        expect(result.rows).toBe(expectedHeight);
        expect(result.cols).toBe(expectedWidth);
    });
});
//# sourceMappingURL=scale-image.function.spec.js.map