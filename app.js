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
    console.log(`Server listening at port ${config.baseURL}:${process.env.PORT}`);
});
dbServer.listen(config.dbPort, ()=>{
    console.log(`Database API listening at ${config.baseURL}:${process.env.PORT}`);
})
if(process.env.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname,'build')));
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'build','index.html'))
    })
}
else{
    app.use(express.static(path.join(__dirname,'public')));
}
let userlist = [];
let userTimeLog = [];

io.on('connection',(socket) => {
    let username;
    let chatroom;

    console.log("Potential client connected...");
    socket.to(chatroom).emit('client_connection', {
        message: "A new user is connecting...",
        userlist: userlist,
    });

    var addedUser = false;

    socket.on('new_message',(data) => {
        let timestamp = Date.now()
        let usr = socket.username;
        let room = socket.chatroom;

        socket.to(chatroom).emit('new_message', {
            username: usr,
            message: data
        })

        axios.post(`${config.baseURL}:${config.dbPort}/event/newEvent`,{
            type: config.events.msg,
            timestamp: timestamp,
            user: usr,
            val: `Room: ${room}`,
        }).then((res) => {
        }).catch((err) => {
            console.log(err);
        })

        axios.post(`${config.baseURL}:${config.dbPort}/chat/newMessage`, {
            room: room,
            timestamp: timestamp,
            sender: usr,
            message: data.message,
        }).then((res) => {
            console.log(`[Room ${data.chatroom}] ${data.username}: ${data.message}`);
        }).catch((err) => {
            console.log(err);
        })

    });

    socket.on('add_user', (data) => {

        username = data.username!=undefined? data.username:"anonymous";
        chatroom = data.chatroom!=undefined? data.chatroom:-1;

        if(addedUser) return;
        //store user to socket session
        socket.username=data.username;
        addedUser = true;
        userTimeLog = userTimeLog.concat([socket.username, Date()]);
        console.log(`${username} connected to room ${chatroom}`);
        socket.join(chatroom);

        axios.post(`${config.baseURL}:${config.dbPort}/event/newEvent`,{
            type: config.events.conn,
            timestamp: Date.now(),
            user: username,
            val:`Room: ${chatroom}`,
        }).then((res) => {
            console.log(`Status: ${res.statusCode}`);
        }).catch((err) => {
            console.log(err);
        })

        socket.to(chatroom).emit('login', {
            userlist:userlist,
        });
    });

    socket.on('change_username', (data) => {
        username = data.username;
        chatroom = data.chatroom;
        axios.post(`${config.baseURL}:${config.dbPort}/event/newEvent`,{
            type: config.events.namechange,
            timestamp: Date.now(),
            user: username,
            val: `${data.chatroom}`,
        }).then((res) => {
            console.log(`Status: ${res.statusCode}`);
        }).catch((err) => {
            console.log(err);
        })
        socket.to(chatroom).emit('change_username', {
            username:username,
            chatroom:chatroom,
            userlist:userlist,
        })
    })

    socket.on('username_selected', (data) => {
        userlist = userlist.concat(data.username);
        console.log(userlist);
        socket.to(chatroom).emit('username_selected', {
            username: data.username,
            chatroom: data.chatroom,
            userlist: userlist,
        });
    });

    socket.on('disconnect', () => {
        if(addedUser){
            let leaver = userlist.filter((user)=>user==socket.username);
            let newUserTimeLog = [];
            userlist = userlist.filter((user)=>user!=socket.username);
            for(var iterator = 0; iterator < userTimeLog.length; iterator++){
                if (userTimeLog[iterator][0] == leaver){
                    newUserTimeLog.concat(userTimeLog[iterator]);
                }
            }

            console.log("A user disconnected...");
            console.log(leaver[0] + " has left.");

            axios.post(`${config.baseURL}:${config.dbPort}/event/newEvent`,{
                type: config.events.disconn,
                timestamp: Date.now(),
                user: username,
                val: `Room: ${chatroom}`,
            }).then((res) => {
                console.log(`[${chatroom}] ${username} disconnected.`);
            }).catch((err) => {
                console.log(err);
            })
        }
        socket.to(chatroom).emit('user left', {
            username: username,
            chatroom: chatroom,
            userlist: userlist
        });
    });
});