import express from "express"
import dotenv from "dotenv"
import multer from "multer"
import { supabase } from "./supabase/supabase.mjs"
import { decode } from "base64-arraybuffer"

dotenv.config()
const PORT = process.env.SERVER_PORT

const app = express()
app.use(express.json())

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.get("/", (req, res) => {
    res.send({
        message: "Welcome To hiddevLabs: Supabase"
    })
})

app.post("/api/images", upload.single("file"), async (req, res) => {
    try {
        const file = req.file

        if (!file) return res.status(400).send({
            message: "Please upload a file"
        })

        const fileBase64 = decode(file.buffer.toString("base64"))

        const { data, error } = await supabase.storage
            .from("images")
            .upload(file.originalname, fileBase64, {
                contentType: "image/png",
            })

        if (error) throw error

        const { data: image } = supabase.storage
            .from("images")
            .getPublicUrl(data.path)

        console.log(file)
        res.send({
            image: image.publicUrl
        })
    } catch (err) {
        res.send({
            message: err.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
