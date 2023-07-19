let users = []

const SocketServer = (socket) => {
    //Connect - Disconnect
    socket.on('joinUser', user => {
        // console.log(user._id)
        users.push({id: user._id, socketId: socket.id})
        // console.log({users})
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })

    //Likes
    socket.on('likePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })

    //unlikes
    socket.on('unLikePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })


     //Comments
     socket.on('createComment', newPost => {
        
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

     //Delete
     socket.on('deleteComment', newPost => {
        
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })

    //Follow
    socket.on('follow', newUser => {
        // console.log(newUser)
        
        const user = users.find(user => user.id === newUser._id)
        console.log(user)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    socket.on('unFollow', newUser => {
        // console.log(newUser)
        
        const user = users.find(user => user.id === newUser._id)
        console.log(user)
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })
    //...
}

module.exports = SocketServer