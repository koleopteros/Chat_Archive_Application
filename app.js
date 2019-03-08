const http = require('http');
const io = require('socket.io');
const config = require('./config/config');
const express = require('express');

const app = express();
const server = http.createServer(app);

const port = config.appPort;

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

app.use(express.static('public'));

let userCount = 0;
let userlist = [];

io.on('connection',(socket) => {
    var addedUser = false;

    socket.on('new message',(data) => {
        socket.broadcast.emit('new message', {
            username: socket.username,
            chatroom: socket.chatroom,
            message: data
        });
    });
    socket.on('add user', (username) => {
        if(addedUser) return;
        //store user to socket session
        socket.username=username;
        ++numUsers;
        userlist = userlist.concat(socket.username);
        addedUser = true;
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
            userlist = userlist.filter((user)=>user!=socket.username);
        }
        socket.broadcast.emit('user left', {
            username: socket.username,
            chatroom: socket.chatroom,
            userlist: userlist
        });
    });
});