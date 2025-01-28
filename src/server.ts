import express from 'express';
import { userRoute } from "./routers/User/user_router";
import fileUpload from "express-fileupload"
import { uploadRoute } from "./routers/Uploads/upload_router";

const server = express();

server.use(express.json())
// server.use(fileUpload({debug: true}))

server.use('/user', userRoute)
server.use 
server.use('/upload', uploadRoute)

server.listen(3000, ()=> console.log("Rodando"))