import express from "express"
import cors from "cors"
import simplegit from "simple-git"
import { generate } from "./utils"
import path from "path"
import { getAllFiles } from "./file"
import { uploadFile } from "./aws"

const app = express()
app.use(express.json())
app.use(cors())

app.post("/deploy", async (req, res)=> {
    const repoUrl = req.body.repoUrl
    const id = generate()
    await simplegit().clone(repoUrl, path.join(__dirname, `./output/${id}`))
    const files = getAllFiles(path.join(__dirname, `./output/${id}`))
    files.forEach(async (file)=>{
        await uploadFile(file.slice(__dirname.length+1), file)
    })
    res.json({
        id
    })
})
app.listen(3000, ()=>{
    console.log("Connected at PORT 3000")
})