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

io.on('connection',(socket) => {
    var addedUser = false;

    socket.on('new message',(data) => {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });
    socket.on('add user', (username) => {
        if(addedUser) return;
        //store user to socket session
        socket.username=username;
        ++numUsers;
        addedUser = true;
        socket.emit('login',{
            numUsers: numUsers
        });
        //announce user joined
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    })
});