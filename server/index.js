import Express from "express";
import logger from "morgan"
import { Server } from "socket.io"; 
import { createServer} from "node:http"

const PORT = process.env.PORT ?? 3000

const APP = Express()
const server = createServer(APP)
const io = new Server(server, {
    connectionStateRecovery: {}
})

io.on("connection", (socket) => {
    console.log("usuario conectado")
    socket.on("disconnect", () => {
        console.log("El usuario se ha desconectado")
    })

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg)
    })
})

APP.use(logger("dev"))

APP.get("/",(req, res) => {
    res.sendFile(process.cwd() + "/client/index.html")
})

server.listen(PORT, () => {
    console.log(`Server runnnig on port ${PORT}`)
})