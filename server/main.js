import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import urlRouter from './routes/urlRouter.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', urlRouter)

const MONGO_URI = process.env.MONGO_URI
await mongoose.connect(
    MONGO_URI
).then(()=>{
    console.log('connected to db');
}).catch((e)=>{
    console.log('error', e);
})

app.listen(3000,()=>{
    console.log("app is running on port 3000")
})
