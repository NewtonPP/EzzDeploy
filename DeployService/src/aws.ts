import {S3} from "aws-sdk"
import {dir} from "console"
import fs from "fs"
import path, { dirname } from "path"

const s3 = new S3({
    accessKeyId: "cdc956a4a6a837f250c8b42cd774e128",
    secretAccessKey: "8ac1cf752a5cebf8e3c44c3e41eab2b5582a8f571c7ad3d5128b800439093bda",
    endpoint: "https://d65851999528a7f216caa69a97933e0a.r2.cloudflarestorage.com"
    })

export async function downloadS3Folder (prefix:string) {
    
    const allFiles = await s3.listObjectsV2({
        Bucket:"vercel",
        Prefix:prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async({Key})=>{
        return new Promise(async (resolve) =>{
            if (!Key){
                resolve ("")
                return
            }

        const finalOutputPath = path.join(__dirname,Key)
        const dirName = path.dirname(finalOutputPath);

        if (!fs.existsSync(dirName)){
            fs.mkdirSync(dirName, {recursive:true})
        }
        
        const outputFile = fs.createWriteStream(finalOutputPath);
        s3.getObject({
            Bucket:"vercel",
            Key:Key || ""
        }).createReadStream().pipe(outputFile)
    .on("finish", () => {
        resolve("")
    })}
    ) 
}) || []
        await Promise.all(allPromises?.filter (x => x !== undefined))
   }

export const copyFinalDist = (id:string) =>{

    const folderPath = path.join(__dirname, `output/${id}/dist`)
    const allFiles = getAllFiles(folderPath)
    allFiles.forEach((file)=>{
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file)
    })


   
}

const getAllFiles = (folderPath: string) =>{
    let response : string[] = []

    const filesAndFolders = fs.readdirSync(folderPath)
    filesAndFolders.forEach((file)=>{
        const fullFilePath = path.join(folderPath, file)

        if (fs.statSync(fullFilePath).isDirectory()){
            response = response.concat(getAllFiles(fullFilePath))
        }
        else{
            response.push(fullFilePath)
        }
    })
    return response
 }

 const uploadFile = async (filename: string, localFilePath: string) =>{
    const normalizedKey = filename.replace(/\\/g, "/");
    const fileContent = fs.readFileSync(localFilePath)
    const response = await s3.upload({
        Body:fileContent,
        Bucket:"vercel",
        Key:normalizedKey
    }).promise()
}