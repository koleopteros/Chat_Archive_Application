const http = require('http');
const path = require('path');
const config = require('./backend/config/config');
const express = require('express');
const app = express();
const dbApp = require('./backend/app');
const server = http.createServer(app);
const dbServer = http.createServer(dbApp);
const io = require('socket.io')(server);

server.listen(config.appPort, () => {
    console.log(`Server listening at port ${config.appPort}`);
});
dbServer.listen(config.dbPort, ()=>{
    console.log(`Database API listening at port ${config.dbPort}`);
})

app.use(express.static(path.join(__dirname,'public')));

let userlist = [];
let userTimeLog = [];
var numUsers = 0;

io.on('connection',(socket) => {

    console.log("Potential client connected...");
    socket.broadcast.emit('client_connection', {
        message: "A new user is connecting..."
    });

    var addedUser = false;

    socket.on('new message',(data) => {
        socket.broadcast.emit('new message', {
            username: socket.username,
            chatroom: socket.chatroom,
            message: data
        });
    });
    socket.on('new_message', (data) => {
        socket.broadcast.emit('new_message', {
            username: socket.username,
            chatroom: socket.chatroom,
            message: data
        });
        console.log("new_message broadcast");

    });
    socket.on('add_user', (username) => {
        if(addedUser) return;
        //store user to socket session
        socket.username=username;
        ++numUsers;
        userlist = userlist.concat(socket.username);
        addedUser = true;
        userTimeLog = userTimeLog.concat([socket.username, Date()]);
        console.log("Current User Time Log" + userTimeLog);
        socket.emit('login',{
            userlist: userlist
        });
        //announce user joined
        socket.broadcast.emit('user joined', {
            username: socket.username,
            chatroom: socket.chatroom,
            userlist: userlist
        });
    });
    socket.on('username_selected', (data) => {
        socket.broadcast.emit('username_selected', data);
    });
    socket.on('typing',() => {
        socket.broadcast.emit('typing',{
            username: socket.username
        });
    });
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing',{
            username:socket.username
        });
    });
    socket.on('disconnect', () => {
        if(addedUser){
            let leaver = userlist.filter((user)=>user==socket.username);
            let newUserTimeLog = [];
            userlist = userlist.filter((user)=>user!=socket.username);
            --numUsers;
            for(var iterator = 0; iterator < userTimeLog.length; iterator++){
                if (userTimeLog[iterator][0] == leaver){
                    newUserTimeLog.concat(userTimeLog[iterator]);
                }
            }

            // userTimeLog = userTimeLog.filter((user)=>user!=socket.username);
            console.log("A user disconnected...");
            console.log(leaver[0] + " has left.");
        }
        socket.broadcast.emit('user left', {
            username: socket.username,
            chatroom: socket.chatroom,
            userlist: userlist
        });
    });
});