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
exports.copyFinalDist = void 0;
exports.downloadS3Folder = downloadS3Folder;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "cdc956a4a6a837f250c8b42cd774e128",
    secretAccessKey: "8ac1cf752a5cebf8e3c44c3e41eab2b5582a8f571c7ad3d5128b800439093bda",
    endpoint: "https://d65851999528a7f216caa69a97933e0a.r2.cloudflarestorage.com"
});
function downloadS3Folder(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const allFiles = yield s3.listObjectsV2({
            Bucket: "vercel",
            Prefix: prefix
        }).promise();
        const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map((_a) => __awaiter(this, [_a], void 0, function* ({ Key }) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path_1.default.join(__dirname, Key);
                const dirName = path_1.default.dirname(finalOutputPath);
                if (!fs_1.default.existsSync(dirName)) {
                    fs_1.default.mkdirSync(dirName, { recursive: true });
                }
                const outputFile = fs_1.default.createWriteStream(finalOutputPath);
                s3.getObject({
                    Bucket: "vercel",
                    Key: Key || ""
                }).createReadStream().pipe(outputFile)
                    .on("finish", () => {
                    resolve("");
                });
            }));
        }))) || [];
        yield Promise.all(allPromises === null || allPromises === void 0 ? void 0 : allPromises.filter(x => x !== undefined));
    });
}
const copyFinalDist = (id) => {
    const folderPath = path_1.default.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach((file) => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    });
};
exports.copyFinalDist = copyFinalDist;
const getAllFiles = (folderPath) => {
    let response = [];
    const filesAndFolders = fs_1.default.readdirSync(folderPath);
    filesAndFolders.forEach((file) => {
        const fullFilePath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
const uploadFile = (filename, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizedKey = filename.replace(/\\/g, "/");
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const response = yield s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: normalizedKey
    }).promise();
});
