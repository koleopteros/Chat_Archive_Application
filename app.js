const http = require('http');
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

app.use(express.static('public'));

app.set('view engine','ejs');
app.get('/', (req,res) => {
    res.render('index');
})

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