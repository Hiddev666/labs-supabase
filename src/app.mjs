import express from "express"
import dotenv from "dotenv"
import multer from "multer"

dotenv.config()
const PORT = process.env.SERVER_PORT

const app = express()
app.use(express.json())

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

app.get("/", (req, res) => {
    res.send({
        message: "Welcome To hiddevLabs: Supabase"
    })
})

app.post("/api/images", upload.single("file"), async (req, res) => {
    try {
        const file = req.file

        if(!file) return res.status(400).send({
            message: "Please upload a file"
        })

        res.send(file)
    } catch (err) {
        res.send({
            message: err.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
