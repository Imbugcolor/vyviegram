let users = [];

const SocketServer = (socket) => {
  //Connect - Disconnect
  socket.on("joinUser", (user) => {
    // console.log(user._id)
    users.push({ id: user._id, socketId: socket.id, followers: user.followers });
  });

  socket.on("disconnect", () => {
    // get user disconnect
    const data = users.find(user => user.socketId === socket.id)
    if(data) {
      // get followers user above is connecting (online) 
      const clients = users.filter(user => 
        data.followers.find(item => item._id === user.id)
      )

      // send response to clients
      if(clients.length > 0) {
        clients.forEach(client => {
          socket.to(`${client.socketId}`).emit('checkUserOffline', data.id)
        })
      }
    }
    users = users.filter(user => user.socketId !== socket.id)
  });

  //Likes
  socket.on("likePost", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("likeToClient", newPost);
      });
    }
  });

  //unlikes
  socket.on("unLikePost", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("unLikeToClient", newPost);
      });
    }
  });

  //Comments
  socket.on("createComment", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createCommentToClient", newPost);
      });
    }
  });

  //Delete
  socket.on("deleteComment", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("deleteCommentToClient", newPost);
      });
    }
  });

  //Follow
  socket.on("follow", (newUser) => {
    // console.log(newUser)

    const user = users.find((user) => user.id === newUser._id);

    user && socket.to(`${user.socketId}`).emit("followToClient", newUser);
  });

  socket.on("unFollow", (newUser) => {
    // console.log(newUser)

    const user = users.find((user) => user.id === newUser._id);
  
    user && socket.to(`${user.socketId}`).emit("unFollowToClient", newUser);
  });
  
  //Notification
  socket.on("createNotify", (msg) => {
    const client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("createNotifyToClient", msg);
  });

  socket.on("removeNotify", (msg) => {
    const client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("removeNotifyToClient", msg);
  });

  //Message
  socket.on('addMessage', msg => {
    const user = users.find((user) => user.id === msg.recipient)
    user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
  })

  // Check User Online / Offline
  socket.on('checkUserOnline', data => {
    //only check following users online/offline
    const following = users.filter(user => data.following.find(item => item._id === user.id))
    socket.emit('checkUserOnlineToMe', following)

    //only request my online to followers
    const clients = users.filter(user => 
      data.followers.find(item => item._id === user.id)
    )
    if(clients.length > 0) {
      clients.forEach(client => {
        socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
      })
    }
  })

  // Typing Message
  socket.on('typing', data => {
    const user = users.find( user => user.id === data.recipient._id )
    user && socket.to(`${user.socketId}`).emit('typingToClient', data)
  })

};

module.exports = SocketServer;
