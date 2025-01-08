import express from "express"
import {S3} from "aws-sdk"

const s3 = new S3({
    accessKeyId: "cdc956a4a6a837f250c8b42cd774e128",
    secretAccessKey: "8ac1cf752a5cebf8e3c44c3e41eab2b5582a8f571c7ad3d5128b800439093bda",
    endpoint: "https://d65851999528a7f216caa69a97933e0a.r2.cloudflarestorage.com"
    })


const app = express()


app.get("/*", async (req,res)=>{
    const host = req.hostname
    const id = host.split(".")[0]
    const filePath = req.path

    const contents = await s3.getObject({
        Bucket:"vercel",
        Key:`dist/${id}${filePath}`
    }).promise()

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type)
    res.send(contents.Body)
})
app.listen(3001)
