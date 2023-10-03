let users = [];

const EditData = (data, id, call) => {
  const newData = data.map(item =>
      item.id === id ? {...item, call} : item
  )
  return newData;
}

const SocketServer = (socket) => {
  //Connect - Disconnect
  socket.on("joinUser", (user) => {
    users.push({ id: user._id, socketId: socket.id, followers: user.followers, role: user.role });
  });

  socket.on("disconnect", () => {
    // get user disconnect
    const data = users.find(user => user.socketId === socket.id)
    if(data) {

      // send response to clients
      if(users.length > 0) {
        users.forEach(client => {
          socket.to(`${client.socketId}`).emit('checkUserOffline', data.id)
        })
      }

      // if user is calling to other user => end Call & response Disconnect 
      if(data.call) {
        const callUser = users.find(user => user.id === data.call)
        if(callUser) {
          users = EditData(users, callUser.id, null)
          socket.to(`${callUser.socketId}`).emit('callerDisconnect')
        }
      }
    }
    users = users.filter(user => user.socketId !== socket.id)
  });

  //Likes
  socket.on("likePost", (newPost) => {
    socket.broadcast.emit("likeToClient", newPost);
  });

  //unlikes
  socket.on("unLikePost", (newPost) => {
    socket.broadcast.emit("unLikeToClient", newPost);
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

  //Like Comment
  socket.on('LikeComment', newPost => {
    socket.broadcast.emit('LikeCommentToClient', newPost)
  })

  // Unlike Comment
  socket.on('UnLikeComment', newPost => {
    socket.broadcast.emit('UnLikeCommentToClient', newPost)      
  })

  //Follow
  socket.on("follow", (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit("followToClient", newUser);
  });

  socket.on("unFollow", (newUser) => {
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

  socket.on('deleteMessages', data => {
    const user = users.find( user => user.id === data.recipient )
    user && socket.to(`${user.socketId}`).emit('deleteMessagesToClient', data)
  })

  // Typing Message
  socket.on('typing', data => {
    const user = users.find( user => user.id === data.recipient._id )
    user && socket.to(`${user.socketId}`).emit('typingToClient', data)
  })

  // Read Message
  socket.on('readMessage', data => {
    const user = users.find( user => user.id === data.sendUser )
    user && socket.to(`${user.socketId}`).emit('readMessageToClient', data)
  })

  // Check User Online / Offline
  socket.on('checkUserOnline', data => {
    //only check following users online/offline
    socket.emit('checkUserOnlineToMe', users)
    
    //only request my online to followers
    if(users.length > 0) {
      users.forEach(client => {
        socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
      })
    }
  })

  // Call
  socket.on('callUser', data => {
    // add call field ( sender ) value is recipient id
    users = EditData(users, data.sender, data.recipient)

    const client = users.find(user => user.id === data.recipient)
    
    // if recipient exist call field , the user is busy ( end call ), else connecting to user...
    if(client) {
      if(client.call) {
          users = EditData(users, data.sender, null)
          socket.emit('userBusy', data)
      } else {
          users = EditData(users, data.recipient, data.sender)
          socket.to(`${client.socketId}`).emit('callUserToClient', data)
      }
    }
  })

  socket.on('endCall', data => {
    const client = users.find(user => user.id === data.sender)

    if(client) {
      // end call sender side
      socket.to(`${client.socketId}`).emit('endCallToClient', data)
      users = EditData(users, client.id, null)
      // end call recipient side
      if(client.call) {
        const clientCall = users.find(user => user.id === client.call)
        clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)
        users = EditData(users, client.call, null)
      }
    }
  })

};

module.exports = SocketServer;
