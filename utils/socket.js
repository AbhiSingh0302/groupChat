exports.socketConnected = (io,socket) => {
    socket.on("send-message",(message,id) => {
        if(id === -1){
            
        }else{
            io.to(id).emit("receive-message", message,id);
        }
    })
}