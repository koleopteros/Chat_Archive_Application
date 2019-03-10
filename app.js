const http = require('http');
const path = require('path');
const config = require('./backend/config/config');

const express = require('express');
const app = express();
const dbApp = require('./backend/app');
const server = http.createServer(app);
const dbServer = http.createServer(dbApp);
const io = require('socket.io')(server);

const axios = require('axios');
axios.default.port = config.dbPort;

server.listen(config.appPort, () => {
    console.log(`Server listening at port ${config.appPort}`);
});
dbServer.listen(config.dbPort, ()=>{
    console.log(`Database API listening at port ${config.dbPort}`);
})

app.use(express.static(path.join(__dirname,'public')));

let userlist = [];
let userTimeLog = [];

io.on('connection',(socket) => {
    console.log("Potential client connected...");
    socket.broadcast.emit('client_connection', {
        message: "A new user is connecting..."
    });

    var addedUser = false;

    socket.on('new message',(data) => {
        let timestamp = Date.now()

        axios.post('http://localhost:4000/event/newEvent',{
            type: config.events.msg,
            timestamp: timestamp,
            user: socket.username,
            val: `Room: ${socket.chatroom}`,
        }).then((res) => {
            console.log(`Status: ${res.statusCode}`);
        }).catch((err) => {
            console.log(err);
        })

        axios.post('http://localhost:4000/chat/newMessage', {
            room: socket.chatroom,
            timestamp: timestamp,
            sender: socket.username,
            message: data,
        }).then((res) => {
            console.log(`Status: ${res.statusCode}`);
        }).catch((err) => {
            console.log(err);
        })

        socket.broadcast.emit('new message', {
            username: socket.username,
            chatroom: socket.chatroom,
            message: data
        });
    });

    socket.on('add_user', (username) => {
        if(addedUser) return;
        //store user to socket session
        socket.username=username;
        userlist = userlist.concat(socket.username);
        addedUser = true;
        userTimeLog = userTimeLog.concat([socket.username, Date()]);
        console.log("Current User Time Log" + userTimeLog);

        axios.post('http://localhost:4000/event/newEvent',{
            type: config.events.conn,
            timestamp: Date.now(),
            user: username,
            val:`Room: ${socket.chatroom}`,
        }).then((res) => {
            console.log(`Status: ${res.statusCode}`);
        }).catch((err) => {
            console.log(err);
        })

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

    socket.on('change_username', (data) => {
        axios.post('http://localhost:4000/event/newEvent',{
            type: config.events.namechange,
            timestamp: Date.now(),
            user: socket.username,
            val: `${data}`,
        }).then((res) => {
            console.log(`Status: ${res.statusCode}`);
        }).catch((err) => {
            console.log(err);
        })
    })

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

            console.log("A user disconnected...");
            console.log(leaver[0] + " has left.");

            axios.post('http://localhost:4000/event/newEvent',{
                type: config.events.disconn,
                timestamp: Date.now(),
                user: username,
                val: `Room: ${socket.chatroom}`,
            }).then((res) => {
                console.log(`Status: ${res.statusCode}`);
            }).catch((err) => {
                console.log(err);
            })
        }
        socket.broadcast.emit('user left', {
            username: socket.username,
            chatroom: socket.chatroom,
            userlist: userlist
        });
    });
});