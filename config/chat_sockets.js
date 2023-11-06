module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer,{
        cors: {
          origin: 'http://3.91.191.113:8000',
          methods: ["GET", "POST"]
        }
      });

    io.sockets.on('connection', function(socket){
        console.log("New connection received",socket.id)

        socket.on('disconnect',function(){
            console.log("Socket Disconnected")
        });


        socket.on('join_room',function(data){
            console.log("Joing request recieved",data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined',data);
        })

        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        })

    })
}