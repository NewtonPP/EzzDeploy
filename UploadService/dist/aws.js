"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "cdc956a4a6a837f250c8b42cd774e128",
    secretAccessKey: "8ac1cf752a5cebf8e3c44c3e41eab2b5582a8f571c7ad3d5128b800439093bda",
    endpoint: "https://d65851999528a7f216caa69a97933e0a.r2.cloudflarestorage.com"
});
const uploadFile = (filename, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizedKey = filename.replace(/\\/g, "/");
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const response = yield s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: normalizedKey
    }).promise();
});
exports.uploadFile = uploadFile;
