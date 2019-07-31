module.exports = io => {
    const users = {};

    io.on("connection", socket => {
        socket.on("login", userID => {
            users[userID] = socket.id;
        });
        
        socket.on("disconnect", () => {
            for (let user in users) {
                if (users[user] === socket.id) {
                    delete users[user];
                }
            }
        });

        socket.on("SEND_MESSAGE", ({ conversation, message }) => {
          conversation.unread.forEach(recipient => {
            socket.to(users[recipient]).emit("DELIVER_MESSAGE", { conversation, message });
          });
        });
        
        socket.on("NEW_CONVERSATION", conversation => {
            conversation.unread.forEach(recipient => {
              socket.to(users[recipient._id]).emit("ADD_CONVERSATION", conversation);
            });
        })
    })
}

