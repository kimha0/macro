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
const nut_js_1 = require("@nut-tree/nut-js");
const image_reader_class_1 = __importDefault(require("./image-reader.class"));
const template_matching_finder_class_1 = __importDefault(require("./template-matching-finder.class"));
jest.mock('jimp', () => { });
describe("Template-matching finder", () => {
    it("findMatch should return a match when present in image", async () => {
        // GIVEN
        const imageLoader = new image_reader_class_1.default();
        const SUT = new template_matching_finder_class_1.default();
        const haystackPath = path.resolve(__dirname, "./__mocks__/mouse.png");
        const needlePath = path.resolve(__dirname, "./__mocks__/needle.png");
        const haystack = await imageLoader.load(haystackPath);
        const needle = await imageLoader.load(needlePath);
        const minConfidence = 0.99;
        const matchRequest = new nut_js_1.MatchRequest(haystack, needle, minConfidence);
        const expectedResult = new nut_js_1.Region(0, 0, needle.width, needle.height);
        // WHEN
        const result = await SUT.findMatch(matchRequest);
        // THEN
        expect(result.confidence).toBeGreaterThanOrEqual(minConfidence);
        expect(result.location).toEqual(expectedResult);
    });
    it("findMatch should return confidence and location of best match if no match with sufficient confidence is found", async () => {
        // GIVEN
        const imageLoader = new image_reader_class_1.default();
        const SUT = new template_matching_finder_class_1.default();
        const haystackPath = path.resolve(__dirname, "./__mocks__/downloads.png");
        const needlePath = path.resolve(__dirname, "./__mocks__/coverage.png");
        const haystack = await imageLoader.load(haystackPath);
        const needle = await imageLoader.load(needlePath);
        const minConfidence = 0.99;
        const matchRequest = new nut_js_1.MatchRequest(haystack, needle, minConfidence);
        const expectedRejection = new RegExp(`^No match with required confidence ${minConfidence}. Best match: \\d.\\d*$`);
        // WHEN
        // THEN
        await expect(SUT.findMatch(matchRequest))
            .rejects
            .toThrowError(expectedRejection);
    });
    it("findMatch should reject, if needle was way larger than haystack", async () => {
        // GIVEN
        const imageLoader = new image_reader_class_1.default();
        const SUT = new template_matching_finder_class_1.default();
        const haystackPath = path.resolve(__dirname, "./__mocks__/mouse.png");
        const needlePath = path.resolve(__dirname, "./__mocks__/fat-needle.png");
        const haystack = await imageLoader.load(haystackPath);
        const needle = await imageLoader.load(needlePath);
        const minConfidence = 0.99;
        const matchRequest = new nut_js_1.MatchRequest(haystack, needle, minConfidence);
        // const expectedRejection = new Error("The provided image sample is larger than the provided search region")
        // WHEN
        const findMatchPromise = SUT.findMatch(matchRequest);
        // THEN
        // await expect(findMatchPromise).rejects.toEqual(expectedRejection)
        await expect(findMatchPromise).rejects.toThrowError("Search input is too large, try using a smaller template image.");
    });
});
//# sourceMappingURL=template-matching-finder.class.spec.js.map