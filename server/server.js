const io = require("socket.io")(5000 , {
    cors : {
        origin : "http://localhost:3000" , 
        methods : ['GET' , 'POST']
    }
})

//io.on listens to whenever client connects with server , a socket is created
io.on("connection" , socket => {
    socket.on("send-changes" , delta => {
        console.log(delta)
    })
})