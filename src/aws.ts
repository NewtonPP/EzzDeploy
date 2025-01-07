import {S3} from "aws-sdk"
import fs from "fs"


const s3 = new S3({
accessKeyId: "cdc956a4a6a837f250c8b42cd774e128",
secretAccessKey: "8ac1cf752a5cebf8e3c44c3e41eab2b5582a8f571c7ad3d5128b800439093bda",
endpoint: "https://d65851999528a7f216caa69a97933e0a.r2.cloudflarestorage.com"
})
export const uploadFile = async (filename: string, localFilePath: string) =>{
    const normalizedKey = filename.replace(/\\/g, "/");
    const fileContent = fs.readFileSync(localFilePath)
    const response = await s3.upload({
        Body:fileContent,
        Bucket:"vercel",
        Key:normalizedKey
    }).promise()
}