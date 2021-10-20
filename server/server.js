const mongoose = require("mongoose");
const Document = require("./Document");

mongoose.connect('mongodb+srv://vansh123:vansh123@devconnector.v0dij.mongodb.net/OnlineTextEditor?retryWrites=true&w=majority')

const io = require("socket.io")(5000 , {
    cors : {
        origin : "http://localhost:3000" , 
        methods : ['GET' , 'POST']
    }
})

const defaultValue = "";

//io.on listens to whenever client connects with server , a socket is created
io.on("connection" , socket => {

    socket.on('get-document' ,async documentId => {
        const document = await findOrCreateDocument({_id : documentId});
        socket.join(documentId); // joining a room where they can communicate with each other 
                                // with roomId as documentId.
        socket.emit("load-document" , document.data);
        socket.on("send-changes" , delta => {
            socket.broadcast.to(documentId).emit("receive-changes" , delta);//sends to all except itself that there are changes
        })

        socket.on("save-document" , async data => {
            await Document.findByIdAndUpdate(documentId , {data})
        })
    })


})

async function findOrCreateDocument(id){
    if(id == null)return;

    const document = await Document.findById(id);
    if(document) return document
    else {
        return await Document.create({_id : id , data : defaultValue});
    }
}