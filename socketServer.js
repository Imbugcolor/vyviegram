let users = []

const SocketServer = (socket) => {
    //Connect - Disconnect
    socket.on('joinUser', user => {
        users.push({id: user._id, socketId: socket.id})
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })

    //Likes
    //...
}

module.exports = SocketServer