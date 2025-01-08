import express from "express"
import cors from "cors"
import simplegit from "simple-git"
import { generate } from "./utils"
import path from "path"
import { getAllFiles } from "./file"
import { uploadFile } from "./aws"
import {createClient} from "redis"

const publisher = createClient()
const subscriber = createClient()
subscriber.connect()
publisher.connect()

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
    await new Promise((resolve) => setTimeout(resolve, 5000))
    
    publisher.lPush("build-queue", id)
    publisher.hSet("status",id,"uploaded")

    res.json({
        id
    })
})

app.get("/status", async (req, res)=>{
    const id = req.query.id
    const response = await subscriber.hGet("status", id as string)
    res.json({
        status:response
    })
})
app.listen(3000, ()=>{
    console.log("Connected at PORT 3000")
})