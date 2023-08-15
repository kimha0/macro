"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const nut_js_1 = require("@nut-tree/nut-js");
const image_reader_class_1 = __importDefault(require("./image-reader.class"));
const image_processor_class_1 = require("./image-processor.class");
jest.mock('jimp', () => { });
describe("ImageProcessor", () => {
    it("should allow to create a cv.Mat from an Image with alpha channel, alpha channel is dropped", async () => {
        // GIVEN
        const imageReader = new image_reader_class_1.default();
        const imagePath = (0, path_1.resolve)(__dirname, "./__mocks__/alpha_channel.png");
        const image = await imageReader.load(imagePath);
        // WHEN
        const mat = await (0, image_processor_class_1.fromImageWithAlphaChannel)(image);
        // THEN
        expect(image.hasAlphaChannel).toBeTruthy();
        expect(mat.channels).toEqual(3);
        expect(mat.rows).toEqual(image.height);
        expect(mat.cols).toEqual(image.width);
        expect(mat.empty).toBeFalsy();
    });
    it("should allow to create a cv.Mat from an Image without alpha channel", async () => {
        // GIVEN
        const imageReader = new image_reader_class_1.default();
        const imagePath = (0, path_1.resolve)(__dirname, "./__mocks__/fat-needle.png");
        const image = await imageReader.load(imagePath);
        // WHEN
        const mat = await (0, image_processor_class_1.fromImageWithoutAlphaChannel)(image);
        // THEN
        expect(image.hasAlphaChannel).toBeFalsy();
        expect(mat.channels).toEqual(3);
        expect(mat.rows).toEqual(image.height);
        expect(mat.cols).toEqual(image.width);
        expect(mat.empty).toBeFalsy();
    });
});
describe("ImageProcessor with ROI", () => {
    it("negative left or top values are updated to 0", async () => {
        // GIVEN
        const imageReader = new image_reader_class_1.default();
        const imagePath = (0, path_1.resolve)(__dirname, "./__mocks__/fat-needle.png");
        const image = await imageReader.load(imagePath);
        // WHEN
        const mat = await (0, image_processor_class_1.fromImageWithoutAlphaChannel)(image, new nut_js_1.Region(-100, -100, 10, 10));
        // THEN
        expect(image.hasAlphaChannel).toBeFalsy();
        expect(mat.channels).toEqual(3);
        expect(mat.rows).toEqual(10);
        expect(mat.cols).toEqual(10);
        expect(mat.empty).toBeFalsy();
    });
    it("values bigger than the input are updated to width and height", async () => {
        // GIVEN
        const imageReader = new image_reader_class_1.default();
        const imagePath = (0, path_1.resolve)(__dirname, "./__mocks__/fat-needle.png");
        const image = await imageReader.load(imagePath);
        // WHEN
        const mat = await (0, image_processor_class_1.fromImageWithoutAlphaChannel)(image, new nut_js_1.Region(10, 10, image.width * 2, image.height * 2));
        // THEN
        expect(image.hasAlphaChannel).toBeFalsy();
        expect(mat.channels).toEqual(3);
        expect(mat.rows).toEqual(image.height - 10);
        expect(mat.cols).toEqual(image.width - 10);
        expect(mat.empty).toBeFalsy();
    });
});
//# sourceMappingURL=image-processor.class.spec.js.map