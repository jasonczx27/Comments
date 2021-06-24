const express = require('express');
// var http = require('http').Server(express);
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8945;


//========= USED FOR WEBSOCKET API =========
app.get('/ws', function (req, res) {
    let action = req.query.action;
    let Message = {
        sockid: "Server",
        room: "Global",
        now: new Date()
    }
    if (action == "chatting") {
        Message.msg = "HI, I'M CHATTING"
        sendmessage(Message);
    }
    else if (action == "loading") {
        Message.msg = "HI, LOADING"
        sendmessage(Message);
    }
    else {
        Message.msg = "Action required"
        sendmessage(Message);
    }
    res.header('Content-Type', 'text/html').send("<html>Reload OK </html>");
});


const server = app.listen(port, function () { console.log('App listening on ' + port); });
const io = socket(server);
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

app.get('/', function (req, res) {
    res.status(200).send('HELLO WORLD')
})


io.on('connection', function (socket) {

    io.to(socket.id).emit("private", {
        sockid: "Server",
        room: "dms999",
        msg: "Welcome to this page",
        now: new Date()
    })
    socket.on('join', function (msg) {
        socket.join(msg);
        let pack = {
            sockid: socket.id,
            room: msg,
            msg: "joined " + msg,
            now: new Date()
        }
        io.to(socket.id).emit("private", pack)
        pack.msg = socket.id + " joined"
        io.to(msg).emit(pack)

        // socket.to(socket.id).emit('private', )
    })
    socket.on("toroom", (msg) => {
        if (msg.room && msg.msg) {
            const pack = {
                sockid: socket.id,
                room: msg.room,
                msg: msg.msg,
                now: new Date()
            }
            io.to(msg.room).emit("private", pack)
        }
    })
    socket.on('chat', function (msg) {
        const Message = {
            sockid: socket.id,
            room: "Global",
            msg: msg,
            now: new Date()
        }
        io.emit('chat1', Message)
    });

    socket.on('disconnect', sock => {
        console.log("disconnection")
        console.log(sock)
        console.log(socket.id)
        console.log("===D_S_C===")
    });
    socket.on("connect", sock => {
        console.log("connection")
        console.log(sock)
        console.log(socket.id)
        console.log("===C_N_C===")
    })

});


function sendmessage(Message) {
    console.log('Message >> ', Message);
    io.emit('chat1', Message)
    // io.of('/node').to(channel).emit(channel, {msg: Message,user:'Admin'})
}