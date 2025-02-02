import fs from "fs"
import path from "path"

export const getAllFiles = (folderPath: string) =>{
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