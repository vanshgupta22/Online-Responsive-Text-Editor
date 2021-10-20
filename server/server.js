const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/online-text-editor')

const io = require("socket.io")(5000 , {
    cors : {
        origin : "http://localhost:3000" , 
        methods : ['GET' , 'POST']
    }
})

//io.on listens to whenever client connects with server , a socket is created
io.on("connection" , socket => {

    socket.on('get-document' , documentId => {
        const data = "";
        socket.join(documentId); // joining a room where they can communicate with each other 
                                // with roomId as documentId.
        socket.emit("load-document" , data);
        socket.on("send-changes" , delta => {
            socket.broadcast.to(documentId).emit("receive-changes" , delta);//sends to all except itself that there are changes
        })
    })


})