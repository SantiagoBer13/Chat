import Express from "express";
import logger from "morgan"
import { Server } from "socket.io"; 
import { createServer} from "node:http"
import { insertMessages, getMessages} from "./controllers/message.controller.js"; 

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

    socket.on("chat message", async (msg) => {
        insertMessages(msg).then(id => {
            io.emit("chat message", msg, id) // Aquí se accede al resultado cuando la promesa se resuelve
        }).catch(error => {
            console.error(error); // Aquí se maneja cualquier error que ocurra durante la ejecución de la promesa
        });
    })

    if(!socket.recovered){
        getMessages(socket.handshake.auth.serverOffset).then(messages => {
            messages.forEach(message => {
                socket.emit("chat message", message.message, message.id)
            })
        })
    }
})

APP.use(logger("dev"))

APP.get("/",(req, res) => {
    res.sendFile(process.cwd() + "/client/index.html")
})


server.listen(PORT, () => {
    console.log(`Server runnnig on port ${PORT}`)
})