import express from "express"
import cors from "cors"

// socket
import { Server } from "socket.io";
import {createServer} from "http";

const app = express();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));

io.use((socket, next) => {
    next()
})


app.get("/", (req, res) => {
    res.send("Hello")
});

io.on("connection", (socket) => {
    console.log("user connected");
    console.log("Id", socket.id);
    // socket.emit("welcome", "welcome to socket.io");
    // socket.broadcast.emit("welcome", `${socket.id} join`);

    socket.on("message", (data) => {
        console.log(data);
        // io.emit("receive-message", data)
        // socket.broadcast.emit("receive-message", data)
        socket.to(data.room).emit("receive-message", data.message)
    });

    // room
    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(room);
    });

    socket.on("disconnected", () => {
        console.log("user Disconnect");
    });
});


server.listen(3000, () => {
    console.log("server connect");
});