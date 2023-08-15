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
const image_reader_class_1 = __importDefault(require("./image-reader.class"));
jest.mock('jimp', () => { });
describe("Image loader", () => {
    it("should resolve to a non-empty Mat on successful load", async () => {
        // GIVEN
        const SUT = new image_reader_class_1.default();
        const imagePath = path.resolve(__dirname, "./__mocks__/mouse.png");
        // WHEN
        const result = await SUT.load(imagePath);
        // THEN
        expect(result.height).toBeGreaterThan(0);
        expect(result.width).toBeGreaterThan(0);
    });
    it("loadImage should reject on unsuccessful load", async () => {
        // GIVEN
        const SUT = new image_reader_class_1.default();
        const imagePath = "./__mocks__/foo.png";
        // WHEN
        const call = SUT.load;
        // THEN
        await expect(call(imagePath)).rejects.toEqual(`Failed to load image from '${imagePath}'`);
    });
});
//# sourceMappingURL=image-reader.class.spec.js.map